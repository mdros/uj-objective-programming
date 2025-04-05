<?php

namespace App\Controller;

// ...
use App\Entity\Product;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;

class ProductController extends AbstractController
{

    #[Route('/product', name: 'get_products', methods: ['GET'])]
    public function getProducts(EntityManagerInterface $entityManager): Response
    {
        $repository = $entityManager->getRepository(Product::class);
        $products = $repository->findAll();

        $productData = array_map(function (Product $product) {
            return [
                'id' => $product->getId(),
                'name' => $product->getName(),
            ];
        }, $products);

        return $this->json($productData);
    }

    #[Route('/product/{id}', name: 'get_product_by_id', methods: ['GET'])]
    public function getProductById(int $id, EntityManagerInterface $entityManager): Response
    {
        $repository = $entityManager->getRepository(Product::class);
        $product = $repository->find($id);

        if (!$product) {
            return $this->json(['error' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        $productData = [
            'id' => $product->getId(),
            'name' => $product->getName(),
        ];

        return $this->json($productData);
    }

    #[Route('/product', name: 'create_product', methods: ['POST'])]
    public function createProduct(EntityManagerInterface $entityManager): Response
    {
        $product = new Product();
        $product->setName('Keyboard');

        $entityManager->persist($product);
        $entityManager->flush();

        return new Response('Saved new product with id ' . $product->getId());
    }

    #[Route('/product/{id}', name: 'delete_product', methods: ['DELETE'])]
    public function deleteProduct(int $id, EntityManagerInterface $entityManager): Response
    {
        $repository = $entityManager->getRepository(Product::class);
        $product = $repository->find($id);

        if (!$product) {
            return $this->json(['error' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        $entityManager->remove($product);
        $entityManager->flush();

        return $this->json(['message' => 'Product deleted successfully']);
    }

    #[Route('/product/{id}', name: 'update_product', methods: ['PATCH'])]
    public function updateProduct(int $id, EntityManagerInterface $entityManager, Request $request): Response
    {
        $repository = $entityManager->getRepository(Product::class);
        $product = $repository->find($id);

        if (!$product) {
            return $this->json(['error' => 'Product not found'], Response::HTTP_NOT_FOUND);
        }

        $data = json_decode($request->getContent(), true);
        if (!isset($data['name']) || empty($data['name'])) {
            return $this->json(['error' => 'Name is required'], Response::HTTP_BAD_REQUEST);
        }

        $product->setName($data['name']);
        $entityManager->flush();

        return $this->json([
            'message' => 'Product updated successfully',
            'product' => [
                'id' => $product->getId(),
                'name' => $product->getName(),
            ],
        ]);
    }
}
