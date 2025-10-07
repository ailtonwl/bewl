class Config {
  constructor() {
    this.env = 'development'
    this.PORT = process.env.PORT || 8080
    this.API_BASE = '/'
    this.DATABASE_HOST = 'localhost'
    this.DATABASE_PORT = process.env.DATABASE_PORT || 5432
    this.DATABASE = 'wlvendas'
    this.DATABASE_USERNAME = 'postgres'
    this.DATABASE_PASSWORD = 'root'
    this.JWT_SECRET = 'sdDMna9HFJthredonyheUdlUo9Qz0p2ky0BQl0a5PsHmaFl0J80MyJyqZgskx1KF$S!dy!hu3Rauvg!L27'
    this.COOKIE_SECURE = false
    this.COOKIE_SAME_SITE = 'Strict'
    this.PUBLIC_ROUTES = ['/', '/signup', '/signin']
    this.CLIENT_URL = 'http://localhost:3000'
  }
}

module.exports = new Config()
