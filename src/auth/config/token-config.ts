export default () => ({
    jwt: {
        accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
        accessTokenExpiry: process.env.JWT_ACCESS_TOKEN_EXPIRY || '1h',
        refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
        refreshTokenExpiry: process.env.JWT_REFRESH_TOKEN_EXPIRY || '7d',
    },
});