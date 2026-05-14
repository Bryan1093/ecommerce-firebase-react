/* eslint-disable react-refresh/only-export-components */
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'

const THEME_STORAGE_KEY = 'appThemePreference'
const LANGUAGE_STORAGE_KEY = 'appLanguagePreference'
const DEFAULT_LANGUAGE = 'es'
const DEFAULT_THEME = 'light'

const dictionary = {
  es: {
    app: {
      name: 'Mi Tienda',
      panel: 'Panel',
      settings: 'Configuración',
      locale: 'es-CO',
    },
    navigation: {
      home: 'Inicio',
      products: 'Productos',
      cart: 'Carrito',
      settings: 'Configuración',
      addProduct: 'Agregar producto',
      viewStore: 'Ver tienda',
      panel: 'Panel',
    },
    themes: {
      light: 'Claro',
      dark: 'Oscuro',
    },
    languages: {
      spanish: 'Español',
      english: 'Inglés',
      portuguese: 'Portugués',
    },
    common: {
      close: 'Cerrar notificación',
      notifications: 'Notificaciones',
      previous: 'Anterior',
      next: 'Siguiente',
      save: 'Guardar',
      cancel: 'Cancelar',
      create: 'Crear',
      page: 'Página',
      of: 'de',
      stock: 'Stock',
      price: 'Precio',
      category: 'Categoría',
      brand: 'Marca',
      tags: 'Etiquetas',
      sku: 'SKU',
      summary: 'Resumen final',
      preview: 'Vista previa',
      allCategories: 'Todas las categorías',
      allStatuses: 'Todos los estados',
      searchPlaceholder: 'Buscar por nombre, marca o SKU',
      loadingProducts: 'Cargando productos',
      progress: 'Progreso',
    },
    categories: {
      electronics: 'Electrónica',
      fashion: 'Moda',
      home: 'Hogar',
    },
    statuses: {
      draft: 'Borrador',
      published: 'Publicado',
      out_of_stock: 'Agotado',
    },
    header: {
      themeToggle: 'Cambiar a tema {theme}',
      currentTheme: 'Tema actual: {theme}',
    },
    footer: {
      text: '© {year} Mi Tienda · Inspirado en interfaces tipo marketplace/app store.',
    },
    home: {
      eyebrow: 'Lo más vendido esta semana',
      title: 'Vende con una experiencia tipo marketplace',
      description:
        'Gestiona catálogo, crea productos paso a paso y publica con una interfaz intuitiva, rápida y preparada para crecer.',
      goToPanel: 'Ir al panel',
      addProduct: 'Agregar producto',
      goToCart: 'Ir al carrito',
      toolsTitle: 'Herramientas del panel',
      toolWizard: '🧭 Wizard guiado',
      toolValidation: '⚡ Validación en vivo',
      toolInventory: '📦 Estados de inventario',
      toolFilters: '📊 Filtros y paginación',
      featuredTitle: 'Destacados para ti',
      heroAlt: 'Colección de productos destacados',
    },
    cart: {
      eyebrow: 'Mis compras',
      title: 'Carrito',
      description: 'Tu carrito está vacío por ahora.',
    },
    settings: {
      eyebrow: 'Preferencias de la experiencia',
      title: 'Configuración',
      subtitle:
        'Personaliza la app con tu tema favorito y el idioma que prefieras para navegar la tienda y el panel.',
      appearanceTitle: 'Apariencia',
      appearanceDescription: 'Elige cómo quieres ver la interfaz durante tu sesión y en futuras visitas.',
      languageTitle: 'Idioma',
      languageDescription: 'Selecciona el idioma principal para la navegación, botones y mensajes de la app.',
      previewTitle: 'Resumen actual',
      previewTheme: 'Tema activo',
      previewLanguage: 'Idioma activo',
      themeLabel: 'Selecciona un tema',
      languageLabel: 'Selecciona un idioma',
      savedMessage: 'Tus preferencias se guardan automáticamente en este dispositivo.',
    },
    products: {
      eyebrow: 'Gestión profesional',
      title: 'Catálogo de productos',
      importCsv: 'Importar CSV',
      addProduct: '+ Agregar producto',
      emptyTitle: 'No hay resultados con esos filtros',
      emptyDescription: 'Prueba otros filtros o crea tu primer producto para empezar a vender.',
      createProduct: 'Crear producto',
      newest: 'Más recientes',
      priceLow: 'Precio menor',
      priceHigh: 'Precio mayor',
      nameAsc: 'Nombre A-Z',
      edit: 'Editar',
      duplicate: 'Duplicar',
      pause: 'Pausar',
      outOfStock: 'Agotado',
      delete: 'Eliminar',
      lastChange: 'Último cambio: {user} · {date}',
      pageLabel: 'Página {current} de {total}',
      confirmDelete: '¿Seguro que quieres eliminar este producto? Esta acción no se puede deshacer.',
      editToast: 'Edición detallada en la siguiente iteración',
      duplicateToast: 'Producto duplicado en borrador',
      pauseToast: 'Producto movido a borrador',
      deleteToast: 'Producto eliminado',
      outOfStockToast: 'Producto marcado como agotado',
      csvEmpty: 'El CSV no contiene filas para importar',
      csvInvalid: 'No se encontraron productos válidos en el CSV',
      csvImported: 'Se importaron {count} productos',
      importedHistory: 'Producto importado por CSV',
      duplicatedHistory: 'Producto duplicado por Bryan',
      pausedHistory: 'Producto pausado',
      outOfStockHistory: 'Stock marcado como agotado',
    },
    newProduct: {
      eyebrow: 'Alta guiada',
      title: 'Agregar nuevo producto',
      saveDraft: 'Guardar borrador',
      backToCatalog: 'Volver al catálogo',
      marketplaceQuality: 'Completa el flujo para publicar con calidad de marketplace.',
      draftSavedAt: 'Borrador guardado: {time}',
      manualSaveToast: 'Borrador guardado manualmente',
      stepErrorToast: 'Corrige los campos marcados para continuar',
      submitErrorToast: 'Completa todos los campos obligatorios antes de publicar',
      publish: 'Publicar producto',
      continue: 'Continuar',
      basicInfo: 'Información básica',
      pricing: 'Precio y stock',
      media: 'Imágenes y variantes',
      summary: 'Resumen y publicación',
      stepLabel: 'Paso {step} de {total}: {title}',
      productName: 'Nombre del producto',
      category: 'Categoría',
      brand: 'Marca',
      sku: 'SKU',
      price: 'Precio',
      stock: 'Stock',
      discount: 'Descuento (%)',
      tax: 'Impuesto (%)',
      imageUrl: 'URL imagen principal',
      sizes: 'Tallas (separadas por coma)',
      colors: 'Colores (separados por coma)',
      warrantyMonths: 'Garantía en meses',
      tags: 'Etiquetas (separadas por coma)',
      previewAlt: 'Vista previa del producto',
      summaryTitle: 'Resumen final',
      previewTitle: 'Vista previa',
      productNamePlaceholder: 'Ej: Smartwatch Pro',
      brandPlaceholder: 'Ej: NovaTech',
      skuPlaceholder: 'Ej: NVT-SWP-01',
      imagePlaceholder: 'https://...',
      sizesPlaceholder: 'S, M, L',
      colorsPlaceholder: 'Negro, Azul',
      tagsPlaceholder: 'smart, audio, premium',
      validation: {
        requiredName: 'El nombre es obligatorio.',
        requiredBrand: 'La marca es obligatoria.',
        requiredSku: 'El SKU es obligatorio.',
        requiredCategory: 'Selecciona una categoría.',
        positivePrice: 'El precio debe ser mayor que 0.',
        nonNegativeStock: 'El stock no puede ser negativo.',
        discountRange: 'El descuento debe estar entre 0% y 90%.',
        taxRange: 'El impuesto debe estar entre 0% y 100%.',
        requiredImage: 'Agrega una URL de imagen principal.',
        requiredSizes: 'Para moda, define al menos una talla.',
        requiredColors: 'Para moda, define al menos un color.',
        warrantyRange: 'Define meses de garantía mayores a 0.',
        requiredTags: 'Añade al menos una etiqueta.',
      },
      breadcrumbs: {
        panel: 'Panel',
        products: 'Productos',
        newProduct: 'Nuevo producto',
      },
      createdHistory: 'Producto creado y publicado por Bryan',
      publishedToast: 'Producto publicado correctamente',
    },
  },
  en: {
    app: {
      name: 'My Store',
      panel: 'Dashboard',
      settings: 'Settings',
      locale: 'en-US',
    },
    navigation: {
      home: 'Home',
      products: 'Products',
      cart: 'Cart',
      settings: 'Settings',
      addProduct: 'Add product',
      viewStore: 'View store',
      panel: 'Dashboard',
    },
    themes: {
      light: 'Light',
      dark: 'Dark',
    },
    languages: {
      spanish: 'Spanish',
      english: 'English',
      portuguese: 'Portuguese',
    },
    common: {
      close: 'Close notification',
      notifications: 'Notifications',
      previous: 'Previous',
      next: 'Next',
      save: 'Save',
      cancel: 'Cancel',
      create: 'Create',
      page: 'Page',
      of: 'of',
      stock: 'Stock',
      price: 'Price',
      category: 'Category',
      brand: 'Brand',
      tags: 'Tags',
      sku: 'SKU',
      summary: 'Final summary',
      preview: 'Preview',
      allCategories: 'All categories',
      allStatuses: 'All statuses',
      searchPlaceholder: 'Search by name, brand, or SKU',
      loadingProducts: 'Loading products',
      progress: 'Progress',
    },
    categories: {
      electronics: 'Electronics',
      fashion: 'Fashion',
      home: 'Home',
    },
    statuses: {
      draft: 'Draft',
      published: 'Published',
      out_of_stock: 'Out of stock',
    },
    header: {
      themeToggle: 'Switch to {theme} theme',
      currentTheme: 'Current theme: {theme}',
    },
    footer: {
      text: '© {year} My Store · Inspired by marketplace/app store interfaces.',
    },
    home: {
      eyebrow: 'Best sellers this week',
      title: 'Sell with a marketplace-style experience',
      description:
        'Manage your catalog, create products step by step, and publish with an intuitive, fast interface built to scale.',
      goToPanel: 'Go to dashboard',
      addProduct: 'Add product',
      goToCart: 'Go to cart',
      toolsTitle: 'Dashboard tools',
      toolWizard: '🧭 Guided wizard',
      toolValidation: '⚡ Live validation',
      toolInventory: '📦 Inventory states',
      toolFilters: '📊 Filters and pagination',
      featuredTitle: 'Featured for you',
      heroAlt: 'Collection of featured products',
    },
    cart: {
      eyebrow: 'My orders',
      title: 'Cart',
      description: 'Your cart is empty for now.',
    },
    settings: {
      eyebrow: 'Experience preferences',
      title: 'Settings',
      subtitle:
        'Customize the app with your favorite theme and the language you prefer to browse the store and dashboard.',
      appearanceTitle: 'Appearance',
      appearanceDescription: 'Choose how you want the interface to look during this session and future visits.',
      languageTitle: 'Language',
      languageDescription: 'Select the main language for the navigation, buttons, and app messages.',
      previewTitle: 'Current summary',
      previewTheme: 'Active theme',
      previewLanguage: 'Active language',
      themeLabel: 'Choose a theme',
      languageLabel: 'Choose a language',
      savedMessage: 'Your preferences are automatically saved on this device.',
    },
    products: {
      eyebrow: 'Professional management',
      title: 'Product catalog',
      importCsv: 'Import CSV',
      addProduct: '+ Add product',
      emptyTitle: 'No results match those filters',
      emptyDescription: 'Try different filters or create your first product to start selling.',
      createProduct: 'Create product',
      newest: 'Newest first',
      priceLow: 'Lowest price',
      priceHigh: 'Highest price',
      nameAsc: 'Name A-Z',
      edit: 'Edit',
      duplicate: 'Duplicate',
      pause: 'Pause',
      outOfStock: 'Out of stock',
      delete: 'Delete',
      lastChange: 'Last update: {user} · {date}',
      pageLabel: 'Page {current} of {total}',
      confirmDelete: 'Are you sure you want to delete this product? This action cannot be undone.',
      editToast: 'Detailed editing coming in the next iteration',
      duplicateToast: 'Product duplicated as draft',
      pauseToast: 'Product moved to draft',
      deleteToast: 'Product deleted',
      outOfStockToast: 'Product marked as out of stock',
      csvEmpty: 'The CSV file does not contain rows to import',
      csvInvalid: 'No valid products were found in the CSV',
      csvImported: '{count} products were imported',
      importedHistory: 'Product imported from CSV',
      duplicatedHistory: 'Product duplicated by Bryan',
      pausedHistory: 'Product paused',
      outOfStockHistory: 'Stock marked as out of stock',
    },
    newProduct: {
      eyebrow: 'Guided creation',
      title: 'Add new product',
      saveDraft: 'Save draft',
      backToCatalog: 'Back to catalog',
      marketplaceQuality: 'Complete the flow to publish with marketplace quality.',
      draftSavedAt: 'Draft saved: {time}',
      manualSaveToast: 'Draft saved manually',
      stepErrorToast: 'Fix the highlighted fields to continue',
      submitErrorToast: 'Complete all required fields before publishing',
      publish: 'Publish product',
      continue: 'Continue',
      basicInfo: 'Basic information',
      pricing: 'Pricing and stock',
      media: 'Images and variants',
      summary: 'Summary and publish',
      stepLabel: 'Step {step} of {total}: {title}',
      productName: 'Product name',
      category: 'Category',
      brand: 'Brand',
      sku: 'SKU',
      price: 'Price',
      stock: 'Stock',
      discount: 'Discount (%)',
      tax: 'Tax (%)',
      imageUrl: 'Main image URL',
      sizes: 'Sizes (comma separated)',
      colors: 'Colors (comma separated)',
      warrantyMonths: 'Warranty in months',
      tags: 'Tags (comma separated)',
      previewAlt: 'Product preview',
      summaryTitle: 'Final summary',
      previewTitle: 'Preview',
      productNamePlaceholder: 'Ex: Smartwatch Pro',
      brandPlaceholder: 'Ex: NovaTech',
      skuPlaceholder: 'Ex: NVT-SWP-01',
      imagePlaceholder: 'https://...',
      sizesPlaceholder: 'S, M, L',
      colorsPlaceholder: 'Black, Blue',
      tagsPlaceholder: 'smart, audio, premium',
      validation: {
        requiredName: 'Product name is required.',
        requiredBrand: 'Brand is required.',
        requiredSku: 'SKU is required.',
        requiredCategory: 'Select a category.',
        positivePrice: 'Price must be greater than 0.',
        nonNegativeStock: 'Stock cannot be negative.',
        discountRange: 'Discount must be between 0% and 90%.',
        taxRange: 'Tax must be between 0% and 100%.',
        requiredImage: 'Add a main image URL.',
        requiredSizes: 'For fashion, add at least one size.',
        requiredColors: 'For fashion, add at least one color.',
        warrantyRange: 'Set warranty months greater than 0.',
        requiredTags: 'Add at least one tag.',
      },
      breadcrumbs: {
        panel: 'Dashboard',
        products: 'Products',
        newProduct: 'New product',
      },
      createdHistory: 'Product created and published by Bryan',
      publishedToast: 'Product published successfully',
    },
  },
  pt: {
    app: {
      name: 'Minha Loja',
      panel: 'Painel',
      settings: 'Configurações',
      locale: 'pt-BR',
    },
    navigation: {
      home: 'Início',
      products: 'Produtos',
      cart: 'Carrinho',
      settings: 'Configurações',
      addProduct: 'Adicionar produto',
      viewStore: 'Ver loja',
      panel: 'Painel',
    },
    themes: {
      light: 'Claro',
      dark: 'Escuro',
    },
    languages: {
      spanish: 'Espanhol',
      english: 'Inglês',
      portuguese: 'Português',
    },
    common: {
      close: 'Fechar notificação',
      notifications: 'Notificações',
      previous: 'Anterior',
      next: 'Próximo',
      save: 'Salvar',
      cancel: 'Cancelar',
      create: 'Criar',
      page: 'Página',
      of: 'de',
      stock: 'Estoque',
      price: 'Preço',
      category: 'Categoria',
      brand: 'Marca',
      tags: 'Tags',
      sku: 'SKU',
      summary: 'Resumo final',
      preview: 'Pré-visualização',
      allCategories: 'Todas as categorias',
      allStatuses: 'Todos os status',
      searchPlaceholder: 'Buscar por nome, marca ou SKU',
      loadingProducts: 'Carregando produtos',
      progress: 'Progresso',
    },
    categories: {
      electronics: 'Eletrônicos',
      fashion: 'Moda',
      home: 'Casa',
    },
    statuses: {
      draft: 'Rascunho',
      published: 'Publicado',
      out_of_stock: 'Sem estoque',
    },
    header: {
      themeToggle: 'Mudar para tema {theme}',
      currentTheme: 'Tema atual: {theme}',
    },
    footer: {
      text: '© {year} Minha Loja · Inspirado em interfaces de marketplace/app store.',
    },
    home: {
      eyebrow: 'Mais vendidos da semana',
      title: 'Venda com uma experiência estilo marketplace',
      description:
        'Gerencie o catálogo, crie produtos passo a passo e publique com uma interface intuitiva, rápida e pronta para crescer.',
      goToPanel: 'Ir para o painel',
      addProduct: 'Adicionar produto',
      goToCart: 'Ir para o carrinho',
      toolsTitle: 'Ferramentas do painel',
      toolWizard: '🧭 Assistente guiado',
      toolValidation: '⚡ Validação em tempo real',
      toolInventory: '📦 Estados de estoque',
      toolFilters: '📊 Filtros e paginação',
      featuredTitle: 'Destaques para você',
      heroAlt: 'Coleção de produtos em destaque',
    },
    cart: {
      eyebrow: 'Minhas compras',
      title: 'Carrinho',
      description: 'Seu carrinho está vazio por enquanto.',
    },
    settings: {
      eyebrow: 'Preferências da experiência',
      title: 'Configurações',
      subtitle:
        'Personalize o app com seu tema favorito e o idioma que preferir para navegar pela loja e pelo painel.',
      appearanceTitle: 'Aparência',
      appearanceDescription: 'Escolha como deseja ver a interface nesta sessão e em futuras visitas.',
      languageTitle: 'Idioma',
      languageDescription: 'Selecione o idioma principal para a navegação, botões e mensagens do app.',
      previewTitle: 'Resumo atual',
      previewTheme: 'Tema ativo',
      previewLanguage: 'Idioma ativo',
      themeLabel: 'Selecione um tema',
      languageLabel: 'Selecione um idioma',
      savedMessage: 'Suas preferências são salvas automaticamente neste dispositivo.',
    },
    products: {
      eyebrow: 'Gestão profissional',
      title: 'Catálogo de produtos',
      importCsv: 'Importar CSV',
      addProduct: '+ Adicionar produto',
      emptyTitle: 'Não há resultados com esses filtros',
      emptyDescription: 'Experimente outros filtros ou crie seu primeiro produto para começar a vender.',
      createProduct: 'Criar produto',
      newest: 'Mais recentes',
      priceLow: 'Menor preço',
      priceHigh: 'Maior preço',
      nameAsc: 'Nome A-Z',
      edit: 'Editar',
      duplicate: 'Duplicar',
      pause: 'Pausar',
      outOfStock: 'Sem estoque',
      delete: 'Excluir',
      lastChange: 'Última alteração: {user} · {date}',
      pageLabel: 'Página {current} de {total}',
      confirmDelete: 'Tem certeza de que deseja excluir este produto? Esta ação não pode ser desfeita.',
      editToast: 'Edição detalhada na próxima iteração',
      duplicateToast: 'Produto duplicado como rascunho',
      pauseToast: 'Produto movido para rascunho',
      deleteToast: 'Produto excluído',
      outOfStockToast: 'Produto marcado como sem estoque',
      csvEmpty: 'O CSV não contém linhas para importar',
      csvInvalid: 'Nenhum produto válido foi encontrado no CSV',
      csvImported: '{count} produtos foram importados',
      importedHistory: 'Produto importado por CSV',
      duplicatedHistory: 'Produto duplicado por Bryan',
      pausedHistory: 'Produto pausado',
      outOfStockHistory: 'Estoque marcado como esgotado',
    },
    newProduct: {
      eyebrow: 'Cadastro guiado',
      title: 'Adicionar novo produto',
      saveDraft: 'Salvar rascunho',
      backToCatalog: 'Voltar ao catálogo',
      marketplaceQuality: 'Conclua o fluxo para publicar com qualidade de marketplace.',
      draftSavedAt: 'Rascunho salvo: {time}',
      manualSaveToast: 'Rascunho salvo manualmente',
      stepErrorToast: 'Corrija os campos destacados para continuar',
      submitErrorToast: 'Preencha todos os campos obrigatórios antes de publicar',
      publish: 'Publicar produto',
      continue: 'Continuar',
      basicInfo: 'Informações básicas',
      pricing: 'Preço e estoque',
      media: 'Imagens e variantes',
      summary: 'Resumo e publicação',
      stepLabel: 'Etapa {step} de {total}: {title}',
      productName: 'Nome do produto',
      category: 'Categoria',
      brand: 'Marca',
      sku: 'SKU',
      price: 'Preço',
      stock: 'Estoque',
      discount: 'Desconto (%)',
      tax: 'Imposto (%)',
      imageUrl: 'URL da imagem principal',
      sizes: 'Tamanhos (separados por vírgula)',
      colors: 'Cores (separadas por vírgula)',
      warrantyMonths: 'Garantia em meses',
      tags: 'Tags (separadas por vírgula)',
      previewAlt: 'Pré-visualização do produto',
      summaryTitle: 'Resumo final',
      previewTitle: 'Pré-visualização',
      productNamePlaceholder: 'Ex: Smartwatch Pro',
      brandPlaceholder: 'Ex: NovaTech',
      skuPlaceholder: 'Ex: NVT-SWP-01',
      imagePlaceholder: 'https://...',
      sizesPlaceholder: 'P, M, G',
      colorsPlaceholder: 'Preto, Azul',
      tagsPlaceholder: 'smart, áudio, premium',
      validation: {
        requiredName: 'O nome do produto é obrigatório.',
        requiredBrand: 'A marca é obrigatória.',
        requiredSku: 'O SKU é obrigatório.',
        requiredCategory: 'Selecione uma categoria.',
        positivePrice: 'O preço deve ser maior que 0.',
        nonNegativeStock: 'O estoque não pode ser negativo.',
        discountRange: 'O desconto deve estar entre 0% e 90%.',
        taxRange: 'O imposto deve estar entre 0% e 100%.',
        requiredImage: 'Adicione uma URL da imagem principal.',
        requiredSizes: 'Para moda, defina pelo menos um tamanho.',
        requiredColors: 'Para moda, defina pelo menos uma cor.',
        warrantyRange: 'Defina meses de garantia maiores que 0.',
        requiredTags: 'Adicione pelo menos uma tag.',
      },
      breadcrumbs: {
        panel: 'Painel',
        products: 'Produtos',
        newProduct: 'Novo produto',
      },
      createdHistory: 'Produto criado e publicado por Bryan',
      publishedToast: 'Produto publicado com sucesso',
    },
  },
}

const categoryConfig = [
  { value: 'Electrónica', key: 'categories.electronics' },
  { value: 'Moda', key: 'categories.fashion' },
  { value: 'Hogar', key: 'categories.home' },
]

const statusConfig = [
  { value: 'draft', key: 'statuses.draft' },
  { value: 'published', key: 'statuses.published' },
  { value: 'out_of_stock', key: 'statuses.out_of_stock' },
]

const languageOptions = [
  { value: 'es', key: 'languages.spanish' },
  { value: 'en', key: 'languages.english' },
  { value: 'pt', key: 'languages.portuguese' },
]

const themeOptions = [
  { value: 'light', key: 'themes.light' },
  { value: 'dark', key: 'themes.dark' },
]

const PreferencesContext = createContext(null)

const getValueByPath = (source, path) =>
  path.split('.').reduce((current, segment) => current?.[segment], source)

function PreferencesProvider({ children }) {
  const [theme, setTheme] = useState(() => localStorage.getItem(THEME_STORAGE_KEY) || DEFAULT_THEME)
  const [language, setLanguage] = useState(() => localStorage.getItem(LANGUAGE_STORAGE_KEY) || DEFAULT_LANGUAGE)

  useEffect(() => {
    localStorage.setItem(THEME_STORAGE_KEY, theme)
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    localStorage.setItem(LANGUAGE_STORAGE_KEY, language)
    document.documentElement.lang = language
  }, [language])

  const t = useCallback(
    (key, params = {}) => {
      const template = getValueByPath(dictionary[language], key) ?? getValueByPath(dictionary.es, key) ?? key

      if (typeof template !== 'string') {
        return template
      }

      return template.replace(/\{(\w+)\}/g, (_, token) => String(params[token] ?? `{${token}}`))
    },
    [language],
  )

  const locale = useMemo(() => t('app.locale'), [t])

  const getCategoryLabel = useCallback(
    (value) => {
      const match = categoryConfig.find((entry) => entry.value === value)
      return match ? t(match.key) : value
    },
    [t],
  )

  const getStatusLabel = useCallback(
    (value) => {
      const match = statusConfig.find((entry) => entry.value === value)
      return match ? t(match.key) : value
    },
    [t],
  )

  const formatCurrency = useCallback(
    (value) =>
      new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: 'USD',
        maximumFractionDigits: 0,
      }).format(Number(value) || 0),
    [locale],
  )

  const formatDateTime = useCallback(
    (value) =>
      new Intl.DateTimeFormat(locale, {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }).format(new Date(value)),
    [locale],
  )

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      language,
      setLanguage,
      t,
      locale,
      languageOptions,
      themeOptions,
      categoryOptions: categoryConfig,
      statusOptions: statusConfig,
      getCategoryLabel,
      getStatusLabel,
      formatCurrency,
      formatDateTime,
    }),
    [theme, language, t, locale, getCategoryLabel, getStatusLabel, formatCurrency, formatDateTime],
  )

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>
}

const usePreferences = () => {
  const context = useContext(PreferencesContext)

  if (!context) {
    throw new Error('usePreferences must be used within PreferencesProvider')
  }

  return context
}

export { PreferencesProvider, usePreferences }
