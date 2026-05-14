/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useMemo, useState } from 'react'
import { orderStatuses, paymentMethods, seedCustomers, seedOrders, seedProducts, seedPromotions } from '../data/storeSeed'
import { DEFAULT_IMAGE_PLACEHOLDER, sanitizeImageUrl } from '../utils/sanitizeImageUrl'

const STORE_STORAGE_KEY = 'ecommercePlatformStateV2'
const StoreContext = createContext(null)

const clone = (value) => JSON.parse(JSON.stringify(value))

const getInitialState = () => {
  const storedValue = localStorage.getItem(STORE_STORAGE_KEY)

  if (!storedValue) {
    return {
      products: seedProducts,
      cartItems: [{ productId: 101, quantity: 1 }],
      wishlistIds: [105],
      orders: seedOrders,
      customers: seedCustomers,
      promotions: seedPromotions,
    }
  }

  try {
    const parsed = JSON.parse(storedValue)
    return {
      products: parsed.products || seedProducts,
      cartItems: parsed.cartItems || [],
      wishlistIds: parsed.wishlistIds || [],
      orders: parsed.orders || seedOrders,
      customers: parsed.customers || seedCustomers,
      promotions: parsed.promotions || seedPromotions,
    }
  } catch {
    return {
      products: seedProducts,
      cartItems: [],
      wishlistIds: [],
      orders: seedOrders,
      customers: seedCustomers,
      promotions: seedPromotions,
    }
  }
}

function StoreProvider({ children }) {
  const [state, setState] = useState(getInitialState)

  const persistState = (nextState) => {
    setState(nextState)
    localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(nextState))
  }

  const updateState = (recipe) => {
    setState((current) => {
      const nextState = recipe(clone(current))
      localStorage.setItem(STORE_STORAGE_KEY, JSON.stringify(nextState))
      return nextState
    })
  }

  const upsertProduct = useCallback((productPayload) => {
    updateState((draft) => {
      const nextProduct = {
        id: productPayload.id ?? Date.now(),
        slug: productPayload.slug,
        name: productPayload.name.trim(),
        category: productPayload.category,
        subcategory: productPayload.subcategory || 'General',
        brand: productPayload.brand.trim(),
        sku: productPayload.sku.trim(),
        price: Number(productPayload.price),
        compareAtPrice: Number(productPayload.compareAtPrice || productPayload.price),
        stock: Number(productPayload.stock),
        reservedStock: Number(productPayload.reservedStock || 0),
        discount: Number(productPayload.discount || 0),
        tax: Number(productPayload.tax || 0),
        rating: Number(productPayload.rating || 5),
        reviewCount: Number(productPayload.reviewCount || 0),
        status: productPayload.status,
        featured: Boolean(productPayload.featured),
        badges: productPayload.badges || [],
        image: sanitizeImageUrl(productPayload.image, DEFAULT_IMAGE_PLACEHOLDER),
        gallery: (productPayload.gallery || [productPayload.image]).map((image) => sanitizeImageUrl(image, DEFAULT_IMAGE_PLACEHOLDER)),
        description: productPayload.description || '',
        highlights: productPayload.highlights || [],
        specs: productPayload.specs || {},
        variants: productPayload.variants || { colors: [], sizes: [], warrantyMonths: 0 },
        tags: productPayload.tags || [],
        sales: Number(productPayload.sales || 0),
        updatedBy: productPayload.updatedBy || 'Bryan',
        updatedAt: new Date().toISOString(),
        history: productPayload.history || ['Producto actualizado desde el panel'],
        reviews: productPayload.reviews || [],
      }

      const existingIndex = draft.products.findIndex((product) => product.id === nextProduct.id)
      if (existingIndex >= 0) {
        draft.products.splice(existingIndex, 1, nextProduct)
      } else {
        draft.products.unshift(nextProduct)
      }
      return draft
    })
  }, [])

  const duplicateProduct = useCallback((productId) => {
    updateState((draft) => {
      const product = draft.products.find((item) => item.id === productId)
      if (!product) return draft
      draft.products.unshift({
        ...product,
        id: Date.now(),
        slug: `${product.slug}-copy-${Date.now()}`,
        name: `${product.name} (copia)`,
        sku: `${product.sku}-COPY`,
        status: 'draft',
        updatedAt: new Date().toISOString(),
        history: ['Producto duplicado desde el panel'],
      })
      return draft
    })
  }, [])

  const updateProductStatus = useCallback((productId, status) => {
    updateState((draft) => {
      draft.products = draft.products.map((product) =>
        product.id === productId
          ? {
              ...product,
              status,
              stock: status === 'out_of_stock' ? 0 : product.stock,
              updatedAt: new Date().toISOString(),
              history: [`Estado actualizado a ${status}`],
            }
          : product,
      )
      return draft
    })
  }, [])

  const deleteProduct = useCallback((productId) => {
    updateState((draft) => {
      draft.products = draft.products.filter((product) => product.id !== productId)
      draft.cartItems = draft.cartItems.filter((item) => item.productId !== productId)
      draft.wishlistIds = draft.wishlistIds.filter((id) => id !== productId)
      return draft
    })
  }, [])

  const importProducts = useCallback((products) => {
    updateState((draft) => {
      draft.products = [...products, ...draft.products]
      return draft
    })
  }, [])

  const addToCart = useCallback((productId, quantity = 1) => {
    updateState((draft) => {
      const line = draft.cartItems.find((item) => item.productId === productId)
      if (line) {
        line.quantity += quantity
      } else {
        draft.cartItems.push({ productId, quantity })
      }
      return draft
    })
  }, [])

  const updateCartQuantity = useCallback((productId, quantity) => {
    updateState((draft) => {
      if (quantity <= 0) {
        draft.cartItems = draft.cartItems.filter((item) => item.productId !== productId)
        return draft
      }

      draft.cartItems = draft.cartItems.map((item) =>
        item.productId === productId ? { ...item, quantity } : item,
      )
      return draft
    })
  }, [])

  const clearCart = useCallback(() => {
    updateState((draft) => {
      draft.cartItems = []
      return draft
    })
  }, [])

  const toggleWishlist = useCallback((productId) => {
    updateState((draft) => {
      draft.wishlistIds = draft.wishlistIds.includes(productId)
        ? draft.wishlistIds.filter((id) => id !== productId)
        : [...draft.wishlistIds, productId]
      return draft
    })
  }, [])

  const placeOrder = useCallback((payload) => {
    let createdOrder = null

    updateState((draft) => {
      const subtotal = draft.cartItems.reduce((accumulator, item) => {
        const product = draft.products.find((entry) => entry.id === item.productId)
        return accumulator + (product?.price || 0) * item.quantity
      }, 0)

      createdOrder = {
        id: `ORD-${Date.now()}`,
        number: `#${String(Date.now()).slice(-4)}`,
        customerId: payload.customerId || 'guest',
        customerName: payload.customerName,
        customerEmail: payload.customerEmail,
        status: 'paid',
        fulfillmentStatus: 'preparing',
        paymentMethod: payload.paymentMethod,
        total: subtotal,
        createdAt: new Date().toISOString(),
        items: draft.cartItems.map((item) => {
          const product = draft.products.find((entry) => entry.id === item.productId)
          return {
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: product?.price || 0,
          }
        }),
        timeline: ['Pago autorizado', 'Pedido recibido por operaciones'],
      }

      draft.orders.unshift(createdOrder)
      draft.products = draft.products.map((product) => {
        const line = draft.cartItems.find((item) => item.productId === product.id)
        if (!line) return product
        const nextStock = Math.max(0, product.stock - line.quantity)
        return {
          ...product,
          stock: nextStock,
          status: nextStock === 0 ? 'out_of_stock' : product.status,
          sales: (product.sales || 0) + line.quantity,
          updatedAt: new Date().toISOString(),
          history: [`Pedido ${createdOrder.number} descontó ${line.quantity} unidades`],
        }
      })
      draft.cartItems = []
      return draft
    })

    return createdOrder
  }, [])

  const updateOrderStatus = useCallback((orderId, status) => {
    if (!orderStatuses.includes(status)) {
      return
    }

    updateState((draft) => {
      draft.orders = draft.orders.map((order) =>
        order.id === orderId
          ? {
              ...order,
              status,
              fulfillmentStatus:
                status === 'shipped'
                  ? 'in_transit'
                  : status === 'delivered'
                    ? 'delivered'
                    : status === 'cancelled'
                      ? 'cancelled'
                      : order.fulfillmentStatus,
              timeline: [`Estado cambiado a ${status}`, ...(order.timeline || [])].slice(0, 4),
            }
          : order,
      )
      return draft
    })
  }, [])

  const cartDetailedItems = useMemo(
    () =>
      state.cartItems
        .map((item) => {
          const product = state.products.find((entry) => entry.id === item.productId)
          if (!product) return null
          return {
            ...item,
            product,
            total: product.price * item.quantity,
          }
        })
        .filter(Boolean),
    [state.cartItems, state.products],
  )

  const wishlistProducts = useMemo(
    () => state.products.filter((product) => state.wishlistIds.includes(product.id)),
    [state.products, state.wishlistIds],
  )

  const lowStockProducts = useMemo(
    () => state.products.filter((product) => product.stock > 0 && product.stock <= 10),
    [state.products],
  )

  const metrics = useMemo(() => {
    const publishedProducts = state.products.filter((product) => product.status === 'published').length
    const totalRevenue = state.orders.reduce((accumulator, order) => accumulator + order.total, 0)
    const averageTicket = state.orders.length ? totalRevenue / state.orders.length : 0
    const bestSeller = [...state.products].sort((a, b) => (b.sales || 0) - (a.sales || 0))[0]

    return {
      publishedProducts,
      totalRevenue,
      averageTicket,
      lowStockCount: lowStockProducts.length,
      bestSeller,
      activeCustomers: state.customers.length,
    }
  }, [lowStockProducts.length, state.customers.length, state.orders, state.products])

  const value = useMemo(
    () => ({
      ...state,
      cartDetailedItems,
      wishlistProducts,
      lowStockProducts,
      metrics,
      paymentMethods,
      persistState,
      upsertProduct,
      duplicateProduct,
      updateProductStatus,
      deleteProduct,
      importProducts,
      addToCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      placeOrder,
      updateOrderStatus,
    }),
    [
      state,
      cartDetailedItems,
      wishlistProducts,
      lowStockProducts,
      metrics,
      persistState,
      upsertProduct,
      duplicateProduct,
      updateProductStatus,
      deleteProduct,
      importProducts,
      addToCart,
      updateCartQuantity,
      clearCart,
      toggleWishlist,
      placeOrder,
      updateOrderStatus,
    ],
  )

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

const useStore = () => {
  const context = useContext(StoreContext)

  if (!context) {
    throw new Error('useStore must be used within StoreProvider')
  }

  return context
}

export { StoreProvider, useStore }
