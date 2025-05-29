import Vapor
import Fluent

struct ProductController: RouteCollection {
    func boot(routes: RoutesBuilder) throws {
        let products = routes.grouped("products")
        products.get(use: index)
        products.post(use: create)
        products.group(":productID") { product in
            product.get(use: get)
            product.put(use: update)
            product.delete(use: delete)
        }
    }

    func index(req: Request) throws -> EventLoopFuture<[Product]> {
        Product.query(on: req.db).all()
    }

    func create(req: Request) throws -> EventLoopFuture<Product> {
        let product = try req.content.decode(Product.self)
        return product.save(on: req.db).map { product }
    }

    func get(req: Request) throws -> EventLoopFuture<Product> {
        Product.find(req.parameters.get("productID"), on: req.db)
            .unwrap(or: Abort(.notFound))
    }

    func update(req: Request) throws -> EventLoopFuture<Product> {
        let updated = try req.content.decode(Product.self)
        return Product.find(req.parameters.get("productID"), on: req.db)
            .unwrap(or: Abort(.notFound)).flatMap { product in
                product.name = updated.name
                product.price = updated.price
                return product.save(on: req.db).map { product }
            }
    }

    func delete(req: Request) throws -> EventLoopFuture<HTTPStatus> {
        Product.find(req.parameters.get("productID"), on: req.db)
            .unwrap(or: Abort(.notFound)).flatMap { product in
                product.delete(on: req.db)
            }.transform(to: .noContent)
    }
}
