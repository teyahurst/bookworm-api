module.exports = {
    PORT: process.env.PORT || 8000,
    NODE_ENV: process.env.NODE_ENV || 'development',
    DATABASE_URL: process.env.DATABASE_URL || 'postgresql://Teyahurst:Password@localhost/bookworm',
    TEST_DATABASE_URL: process.env.TEST_DATABASE_URL || 'postgresql://Teyahurst:Password@localhost/bookworm-test',
    JWT_SECRET: process.env.JWT_SECRET || 'change-this-secret',
    CLIENT_ORIGIN: process.env.CLIENT_ORIGIN 

}