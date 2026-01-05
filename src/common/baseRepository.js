import mongoose from 'mongoose';

// This function creates a new record in the specified model
export const createRecord = async (modelName, data) => {
  try {
    const dynamicImportModel = await import(`../models/${modelName}.js`).then(
      (module) => module.default
    );
    const document = new dynamicImportModel(data);
    return await document.save();
  } catch (error) {
    // Handle duplicate key error
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      throw {
        status: 400,
        message: `${field} already exists.`,
      };
    }
    // Handle other errors
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Error saving to database',
    };
  }
};

// This function fetches a record by its ID from the specified model
export const getRecordById = async (modelName, id) => {
  try {
    // Dynamically import the model based on modelName
    const dynamicImportModel = await import(`../models/${modelName}.js`).then(
      (module) => module.default
    );
    return await dynamicImportModel.findById(id);
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: 'Error fetching records',
      details: error.message,
    };
  }
};

// This function fetches all records from the specified model with optional filtering and pagination
export const getAllRecords = async (modelName, filter = {}, options = {}) => {
  try {
    // Dynamically import the model based on modelName
    const dynamicImportModel = await import(`../models/${modelName}.js`).then(
      (module) => module.default
    );

    // Extract pagination and projection options
    const { page, limit, projection = {} } = options;

    // Extracting pagination and projection options from the options parameter
    let queryOptions = { projection };

    // Setting up basic query options including field projections
    let usePagination = page && limit;

    // If pagination is enabled, calculate skip and limit for MongoDB query
    if (usePagination) {
      const skip = (page - 1) * limit;
      queryOptions.skip = skip;
      queryOptions.limit = limit;
    }

    // Query to find documents based on the filter and options
    const documents = await dynamicImportModel.find(
      filter,
      projection,
      queryOptions
    );

    // If no documents found, return empty result with pagination meta if applicable
    if (!documents || documents.length === 0) {
      return usePagination
        ? { data: [], total: 0, page, limit, totalPages: 0 }
        : [];
    }

    // If using pagination, get total document count for the given filter
    if (usePagination) {
      const total = await dynamicImportModel.countDocuments(filter);
      return {
        data: documents,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };
    }

    // If not using pagination, return the fetched data directly
    return documents;
  } catch (error) {
    // If there's an error, throw a custom error object with relevant info
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Error fetching records',
      details: error.details || error.message,
    };
  }
};

// This function updates a record by its ID in the specified model
export const updateRecordById = async (modelName, id, data) => {
  try {
    // Dynamically import the model based on modelName
    const dynamicImportModel = await import(`../models/${modelName}.js`).then(
      (module) => module.default
    );

    // Find the record by ID and update it with the provided data
    const updatedRecord = await dynamicImportModel.findByIdAndUpdate(id, data, {
      new: true,
      runValidators: true,
    });
    return updatedRecord;
  } catch (error) {
    // Handle other errors
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Error updating record',
    };
  }
};

// This function updates a record based on a filter in the specified model
export const updateRecordByKey = async (modelName, filter, data) => {
  try {
    // Dynamically import the model based on modelName
    const dynamicImportModel = await import(`../models/${modelName}.js`).then(
      (module) => module.default
    );

    // Validate that a filter and data are provided
    if (!filter || Object.keys(filter).length === 0) {
      throw { statusCode: 400, message: 'Filter criteria is required' };
    }

    if (!data || Object.keys(data).length === 0) {
      throw { statusCode: 400, message: 'No valid fields to update' };
    }

    // Find and update the record based on the filter
    const document = await dynamicImportModel.findOneAndUpdate(filter, data, {
      new: true,
      runValidators: true,
    });

    // If no document is found, throw a 404 error
    if (!document) {
      throw { statusCode: 404, message: 'Record not found' };
    }
    return document;
  } catch (error) {
    // Handle other errors
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Error updating record',
      details: error,
    };
  }
};

// This function deletes a record by its ID in the specified model
export const deleteRecordsByKey = async (modelName, filter = {}) => {
  try {
    const dynamicImportModel = await import(`../models/${modelName}.js`).then(
      (module) => module.default
    );
    const result = await dynamicImportModel.deleteMany(filter);
    return {
      deletedCount: result.deletedCount,
      acknowledged: result.acknowledged,
    };
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Error deleting records',
      details: error.details || error.message,
    };
  }
};

// This function deletes multiple records based on a filter in the specified model
export const deleteManyRecords = async (modelName, filter) => {
  try {
    // Dynamically import the model based on modelName
    const dynamicImportModel = await import(`../models/${modelName}.js`).then(
      (module) => module.default
    );

    // Ensure the filter is valid
    if (!filter || typeof filter !== 'object') {
      throw { statusCode: 400, message: 'Invalid filter object' };
    }

    // Perform bulk deletion
    const result = await dynamicImportModel.deleteMany(filter);

    // Check if any documents were deleted
    if (result.deletedCount === 0) {
      throw { statusCode: 404, message: 'No matching records found' };
    }

    return {
      message: `${result.deletedCount} record(s) deleted successfully`,
      deletedCount: result.deletedCount,
    };
  } catch (error) {
    // Handle errors and provide structured responses
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Error deleting records',
      details: error.message,
    };
  }
};

// Function to delete a record by its ID
export const deleteRecordById = async (modelName, id) => {
  try {
    // Dynamically import the model based on modelName
    const dynamicImportModel = await import(`../models/${modelName}.js`).then(
      (module) => module.default
    );

    // Find and delete the record by ID
    const document = await dynamicImportModel.findByIdAndDelete(id);

    // If no document is found, return a 404 error
    if (!document) {
      throw { statusCode: 404, message: 'Record not found' };
    }

    // Return success message and the deleted document
    return { message: 'Record deleted successfully', document };
  } catch (error) {
    // Handle other errors
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Error deleting record',
      details: error.message || 'this is error',
    };
  }
};

// Function to get multiple records without pagination
export const findRecords = async (modelName, filter = {}, projection = {}) => {
  try {
    const dynamicImportModel = await import(`../models/${modelName}.js`).then(
      (module) => module.default
    );
    const records = await dynamicImportModel.find(filter, projection);
    return records;
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Error fetching records',
      details: error.details || error.message,
    };
  }
};

// This function fetches a record by its ID and applies a filter to the query
export const getRecordByIdFilter = async (
  modelName,
  id,
  filter = {},
  populateFields = ''
) => {
  try {
    // Dynamically import the model
    const dynamicImportModel = await import(`../models/${modelName}.js`).then(
      (module) => module.default
    );

    // Validate ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw { statusCode: 400, message: 'Invalid ID format' };
    }

    // Build query
    let query = dynamicImportModel.findOne({ _id: id, ...filter });

    // Apply population (supports string, object, or array of objects)
    if (populateFields) {
      if (Array.isArray(populateFields)) {
        for (const field of populateFields) {
          query = query.populate(field);
        }
      } else {
        query = query.populate(populateFields);
      }
    }

    // Execute query
    const document = await query.exec();
    return document;
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || 'Error fetching record by ID',
      details: error.details || error.message,
    };
  }
};
