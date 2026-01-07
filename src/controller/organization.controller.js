import { constants } from '../common/constant.js';
import { sendSuccessResponse, sendErrorResponse } from '../common/response.js';
import * as OrganizationService from '../services/organization.service.js';

const orgConstant = constants.Organization;
export const createOrganizationController = async (req, res) => {
  try {
    const { name, organization_key } = req.body;

    // Logged-in user (from authGuard)
    const userId = req.user._id;

    const organization = await OrganizationService.createOrganizationService(
      { name, organization_key },
      userId
    );

    return sendSuccessResponse(res, orgConstant.ORG_CREATED, organization, 201);
  } catch (error) {
    return sendErrorResponse(
      res,
      error.statusCode || 500,
      error.message || orgConstant.SERVER_ERROR
    );
  }
};
