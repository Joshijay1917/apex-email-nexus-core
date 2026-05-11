
export default () => ({
    WAHA_API_URL: process.env.WAHA_API_URL || "http://localhost:3001",
    WAHA_API_KEY: process.env.WAHA_API_KEY || '',
    OWNER_PHONE_NUMBER: process.env.OWNER_PHONE_NUMBER || '',
})