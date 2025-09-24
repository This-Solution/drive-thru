import axios from 'axios';
import { method } from 'lodash';

// #region ======== auth =========

// Admin Login
const syncUrl = process.env.REACT_APP_SYNC_URL;
async function loginAsync(payload) {
  const config = {
    method: 'post',
    url: '/auth/login',
    data: payload
  };
  return await axios(config);
}

async function addAdminAsync(payload) {
  const config = {
    method: 'post',
    url: 'admin/user',
    data: payload
  };
  return await axios(config);
}

async function updateAdminAsync(payload) {
  const config = {
    method: 'put',
    url: 'admin/user',
    data: payload
  };
  return await axios(config);
}

async function getRoleListAsync() {
  const config = {
    method: 'get',
    url: 'role'
  };
  return await axios(config);
}

async function getUserListAsync(payload) {
  const config = {
    method: 'get',
    url: 'admin/user-list',
    data: payload
  };
  return await axios(config);
}

async function deleteAdminAsync(systemUserId) {
  const config = {
    method: 'delete',
    url: `admin/user/${systemUserId}`
  };
  return await axios(config);
}

async function updateSyncAsync(payload) {
  const config = {
    method: 'put',
    url: '/admin/sync',
    data: payload
  };
  return await axios(config);
}

async function getSyncDataAsync() {
  const config = {
    method: 'get',
    url: '/admin/syncData'
  };
  return await axios(config);
}

async function getUpdatedItemsAsync() {
  const config = {
    method: 'get',
    url: `${syncUrl}/admin/updated/items`
  };
  return await axios(config);
}

async function updatedCategoriesAsync(subMenuIds) {
  const config = {
    method: 'post',
    url: `${syncUrl}/admin/sync/categories`,
    data: { subMenuIds }
  };
  return await axios(config);
}

async function updatedMenuItemsAsync(posItemIds) {
  const config = {
    method: 'post',
    url: `${syncUrl}/admin/sync/menuItems`,
    data: { posItemIds }
  };
  return await axios(config);
}

async function updatedCombosAsync(menuItemIds) {
  const config = {
    method: 'post',
    url: `${syncUrl}/admin/sync/combo`,
    data: { menuItemIds }
  };
  return await axios(config);
}

async function updatedModifiersAsync(posItemIds) {
  const config = {
    method: 'post',
    url: `${syncUrl}/admin/sync/modifiers`,
    data: { posItemIds }
  };
  return await axios(config);
}

async function sendAuthenticationMailAsync(systemUserId) {
  const config = {
    method: 'post',
    url: '/admin/send-mail',
    data: { systemUserId }
  };
  return await axios(config);
}

async function resetAdminPasswordAsync(payload) {
  const config = {
    method: 'post',
    url: '/admin/reset/admin/password',
    data: payload
  };
  return await axios(config);
}

async function resetPasswordAsync(payload) {
  const config = {
    method: 'post',
    url: '/admin/reset/password',
    data: payload
  };
  return await axios(config);
}

async function renewSessionAsync(payload) {
  const config = {
    method: 'post',
    url: '/admin/renew',
    data: payload
  };
  return await axios(config);
}
// #endregion ======== auth =========


//#start - tenant ====================


async function getTenantsAsync() {
  const config = {
    method: 'get',
    url: '/tenant'
  };

  return await axios(config);
}


async function saveTenantsAsync(payload) {
  const config = {
    method: 'post',
    url: '/tenant',
    data: payload
  };

  return await axios(config);
}


async function getCarDetailsAsync(payload) {
  const config = {
    method: 'post',
    url: '/car/getCarDetail',
    data: payload
  }
  return await axios(config)
}


async function getCurrentOrderAsync(payload) {
  const config = {
    method: 'post',
    url: '/car/getCurrentOrderDetail',
    data: payload
  }
  return await axios(config)
}


async function getLastAndMostPurchaseOrderAsync(payload) {
  const config = {
    method: 'post',
    url: '/car/getLastAndMostPurchaseOrderDetails',
    data: payload
  }

  return await axios(config);
}


async function getCameraConfigAsync(siteId) {
  const config = {
    method: 'post',
    url: `/cameraConfig/${siteId}`
  }

  return await axios(config);
}

// #start-site ======== site =========

async function getSitesAsync() {
  const config = {
    method: 'get',
    url: '/site'
  };
  return await axios(config);
}

async function getSitesOptionsAsync() {
  const config = {
    method: 'get',
    url: '/sites'
  };
  return await axios(config);
}

async function getSiteListAsync() {
  const config = {
    method: 'get',
    url: '/admin/user-site'
  };
  return await axios(config);
}

async function getReportListAsync() {
  const config = {
    method: 'get',
    url: '/lookup/reports'
  };
  return await axios(config);
}

async function getAnalyticsChartsAsync() {
  const config = {
    method: 'get',
    url: '/lookup/charts'
  };
  return await axios(config);
}

async function getSitesByIdAsync(systemUserId) {
  const config = {
    method: 'get',
    url: `/admin/user-sites/${systemUserId}`
  };
  return await axios(config);
}

async function setSiteEnabledStatusAsync(siteId, isEnabled) {
  const config = {
    method: 'put',
    url: `/site/updateEnabled/${siteId}/${isEnabled}`,
    data: { isEnabled }
  };
  return await axios(config);
}

async function updateSiteAsync(siteId, payload) {
  const config = {
    method: 'put',
    url: `/site/${siteId}`,
    data: payload
  };
  return await axios(config);
}

async function addSiteAsync(payload) {
  const config = {
    method: 'post',
    url: `/site`,
    data: payload
  };
  return await axios(config);
}

async function getSiteDetailsAsync(siteId) {
  const config = {
    method: 'get',
    url: `/site/${siteId}`
  };
  return await axios(config);
}

async function updateSiteTimeAsync(siteId, payload) {
  const config = {
    method: 'put',
    url: `/site/${siteId}`,
    data: payload
  };
  return await axios(config);
}

async function getSiteHoursAsync(siteId) {
  const config = {
    method: 'get',
    url: `/site/hours/${siteId}`
  };
  return await axios(config);
}


export default {
  // auth
  loginAsync,
  deleteAdminAsync,
  addAdminAsync,
  updateAdminAsync,
  getRoleListAsync,
  getUserListAsync,
  getSiteListAsync,
  updateSyncAsync,
  getSyncDataAsync,
  getUpdatedItemsAsync,
  updatedCategoriesAsync,
  updatedMenuItemsAsync,
  updatedCombosAsync,
  updatedModifiersAsync,
  sendAuthenticationMailAsync,
  resetAdminPasswordAsync,
  resetPasswordAsync,
  renewSessionAsync,

  // Site
  getSitesAsync,
  getSitesByIdAsync,
  setSiteEnabledStatusAsync,
  updateSiteAsync,
  addSiteAsync,
  getSitesOptionsAsync,
  getSiteDetailsAsync,
  updateSiteTimeAsync,
  getSiteHoursAsync,


  getReportListAsync,
  getAnalyticsChartsAsync,
  //Devices

  getCameraConfigAsync,
  getTenantsAsync,
  getCarDetailsAsync,
  getCurrentOrderAsync,
  getLastAndMostPurchaseOrderAsync,
  saveTenantsAsync

};
