import Vapor
import Fluent
import FluentSQLiteDriver
// configures your application
public func configure(_ app: Application) async throws {
    app.databases.use(.sqlite(.file("db.sqlite")), as: .sqlite)
    app.migrations.add(CreateProduct())

    try routes(app)
}
