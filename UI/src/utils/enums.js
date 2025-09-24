
const enums = {
  ApiResult: {
    Ok: 200,
    Unauthorized: 201,
    BadRequest: 400,
    AccessDenied: 401,
    NotFound: 404,
    Timeout: 408,
    ValidationError: 422,
    InternalServerError: 500,
    InsufficientStorage: 507
  },

  UserStatus: {
    NewUser: 0,
    Active: 1,
    Deactive: 2
  },

  UserStatusName: {
    0: 'New User',
    1: 'Active',
    2: 'Deactive'
  },

  Duration: {
    Today: 0,
    Yesterday: 1,
    CurrentWeek: 2,
    Last7Days: 3,
    CurrentMonth: 4,
    LastMonth: 5,
    ThreeMonths: 6,
    SixMonths: 7,
    CurrentYear: 8,
    LastYear: 9,
    Between: 10
  },

  SortBy: {
    DESC: 2,
    ASC: 1
  },

  userRole: {
    SuperAdmin: 1,
    Admin: 2,
    OrderOperator: 3,
    DeliveryOperator: 4
  },

  cameraType: {
    L: 'Order',
    C: 'Delivery'
  },

  AdminRole: {
    1: 'SUPER_ADMIN',
    2: 'ADMIN',
    3: 'ORDER_OPERATOR',
    4: 'DELIVERY_OPERATOR'
  },
  carStatus: {
    GREEN: 'green',
    RED: 'red',
    PINK: 'pink',
    WHITE: 'WHITE'
  },
  displayAdminRole: {
    superAdmin: 'Super Admin',
    brandCMSAdmin: 'CJ Admin',
    User: 'User',
    siteManager: 'Site Manager',
    posEmployee: 'POS Employee',
  },
  flavour: {
    KFC: 1,
    CJSalesUAT: 2,
    CJSalesProd: 3,
    WIngstop: 4,
    OliveTreeProd: 5,
    OliveTreeUAT: 6,
    KountaUAT: 7
  },

};

export default enums;
