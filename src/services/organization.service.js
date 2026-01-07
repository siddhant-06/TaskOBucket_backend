import * as DataBaseHelper from '../common/baseRepository.js';
import { constants } from '../common/constant.js';

const orgConstant = constants.Organization;

export const createOrganizationService = async (data, userId) => {
  try {
    // Fetch user
    const user = await DataBaseHelper.getRecordById('user.model', userId);

    if (!user) {
      throw { statusCode: 404, message: constants.User.USER_NOT_FOUND };
    }

    //  User already belongs to an organization
    if (user.organizationId) {
      throw {
        statusCode: 400,
        message: orgConstant.ORG_ALREADY_ASSIGNED,
      };
    }

    // Check if organization key already exists
    const existingOrg = await DataBaseHelper.findRecords('organization.model', {
      organization_key: data.organization_key.toUpperCase(),
    });

    if (existingOrg.length) {
      throw { statusCode: 409, message: orgConstant.ORG_KEY_EXISTS };
    }

    // Create organization
    const organization = await DataBaseHelper.createRecord(
      'organization.model',
      {
        name: data.name,
        organization_key: data.organization_key.toUpperCase(),
        createdBy: userId,
      }
    );

    // update user
    await DataBaseHelper.updateRecordById('user.model', userId, {
      organizationId: organization._id,
      isOrgAdmin: true,
    });

    return organization;
  } catch (error) {
    throw {
      statusCode: error.statusCode || 500,
      message: error.message || orgConstant.ORG_NOT_CREATED,
    };
  }
};
