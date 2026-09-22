export const storeServices = {
  getStore: async (storeUrl) => {
    try {
      if (!storeUrl) {
        return {
          message: "Missing required fields",
          statusCode: 400,
        };
      }
      const response = await fetch(
        `https://smartbiz-dashboard.vercel.app/api/store?url=${storeUrl}`      
      );
      const data = await response.json();      
      return data;
    } catch (error) {
      console.log("Error fetching store:", error);
      return {
        message: "Error fetching store",
        statusCode: 500,
      };
    }
  },
};
