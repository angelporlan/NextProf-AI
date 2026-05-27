export type Language = 'es' | 'en';

export const translations = {
  es: {
    common: {
      cancel: 'Cancelar',
      understood: 'Entendido',
    },
    sidebar: {
      menu: {
        cvs: 'Mis CVs',
        kanban: 'Kanban',
        subscription: 'Suscripción',
        adminPanel: 'Panel Admin',
      },
      logout: {
        button: 'Cerrar Sesión',
        confirm: '¿Estás seguro de cerrar sesión?',
        yes: 'Sí, salir',
      },
      profile: {
        candidate: 'Candidato',
      },
    },
    dashboard: {
      banner: {
        title: 'Hola, {name}',
        desc: 'Estás en el Plan Gratuito. El motor de IA gratuito usa OpenRouter. Desbloquea plantillas profesionales e integraciones de IA avanzadas actualizando tu cuenta.',
        upgrade: 'Actualizar a Pro (10 €/mes)',
      },
      stats: {
        active: 'Postulaciones Activas',
        interview: 'En Proceso de Entrevista',
        successful: 'Ofertas Conseguidas',
      },
      cvs: {
        title: 'Tus Currículums',
        subtitle: 'Crea tu currículum base, marca tu principal o genera copias optimizadas.',
        primary: 'Principal: {title}',
        placeholder: 'Nombre del nuevo CV...',
        create: 'Crear CV',
        generateAi: 'Generar con IA',
        empty: {
          title: 'No tienes ningún currículum todavía',
          desc: 'Escribe un título en el campo superior derecho y presiona "Crear CV" para generar tu primer borrador en Markdown. ¡Se marcará como principal automáticamente!',
        },
        card: {
          base: 'Base',
          copy: 'Copia',
          primary: 'Principal',
          setPrimary: 'Establecer como Principal',
          template: 'Plantilla',
          created: 'Creado',
          edit: 'Editar CV',
          delete: 'Borrar Currículum',
        },
      },
      modal: {
        ai: {
          title: 'Optimización Inteligente por IA',
          desc: 'Generaremos un currículum adaptado a partir de tu currículum principal: ',
          building: 'Construyendo tu currículum adaptado',
          freeWarning: 'Atención: Plan Gratuito Activo',
          freeDesc: 'El motor gratuito utiliza análisis estándar. Los socios PRO disfrutan de la máxima precisión semántica y velocidad de redacción con modelos de IA más avanzados.',
          jobTitle: 'Nombre del Puesto *',
          jobTitlePlaceholder: 'Ej. Frontend React Engineer',
          company: 'Empresa *',
          companyPlaceholder: 'Ej. Stripe',
          link: 'Enlace a la Oferta',
          platform: 'Plataforma',
          platformOther: 'Otra',
          mode: 'Modo de Optimización Inteligente',
          defaultMode: 'Por defecto (Estilo Harvard)',
          kanban: 'Registrar automáticamente en el Kanban',
          kanbanDesc: 'Si está activado, creará una nueva candidatura vinculada a esta oferta en tu tablero Kanban.',
          descLabel: 'Descripción / Requisitos de la Oferta *',
          descPlaceholder: 'Pega aquí la descripción detallada de la oferta, incluyendo las responsabilidades y habilidades requeridas.',
          close: 'Cerrar',
          start: 'Iniciar Optimización por IA',
        },
      },
      alert: {
        primary: {
          title: 'Se requiere un CV Principal',
          msg: 'Para generar un nuevo currículum personalizado con IA desde el Dashboard, primero debes configurar uno de tus currículums como principal.\n\nEsto nos sirve como base con toda tu información para que la IA realice una excelente adaptación.\n\nPuedes marcar cualquiera de tus currículums haciendo clic en su icono de estrella en su tarjeta correspondiente.',
        },
        delete: {
          title: '¿Eliminar Currículum?',
          msg: 'Esta acción no se puede deshacer y borrará permanentemente este currículum de tu cuenta. Si es tu currículum principal, reasignaremos automáticamente otra de tus bases como principal.',
          confirm: 'Sí, eliminar',
        },
      },
      steps: {
        keywords: 'Extrayendo palabras clave de la oferta...',
        analyze: 'Analizando tu experiencia y habilidades del CV Principal...',
        align: 'Alineando tu perfil con los requisitos clave...',
        generate: 'Generando copia optimizada sin perder la verdad del contenido...',
        create: 'Creando CV y registrando candidatura en el Kanban...',
        success: '¡Completado con éxito! Redirigiendo...',
      },
      errors: {
        noPrimary: 'No hay ningún CV principal designado.',
        required: 'El puesto, empresa y descripción de la oferta son obligatorios.',
        unexpected: 'Ocurrió un error inesperado.',
        createFail: 'Error al crear el currículum.',
      },
      modes: {
        fidelity: {
          name: 'Modo Fidelidad',
          desc: 'Fidelidad absoluta a tu trayectoria real. No inventa habilidades ni herramientas; optimiza tu redacción e integra palabras clave para pasar filtros ATS.',
        },
        performance: {
          name: 'Modo Rendimiento',
          desc: 'Amplía y potencia tu experiencia de forma realista. Si dominas tecnologías equivalentes, las integra estratégicamente y optimiza la densidad ATS.',
        },
        extreme: {
          name: 'Modo Extremo',
          desc: 'Foco absoluto en superar el filtro ATS. Adapta tu CV e inyecta cualquier tecnología o requisito crítico exigido por la oferta para un match del 100%.',
        },
        default: {
          desc: 'Optimiza tu currículum de acuerdo a la oferta elegida.',
        },
      },
    },
  },
  en: {
    common: {
      cancel: 'Cancel',
      understood: 'Understood',
    },
    sidebar: {
      menu: {
        cvs: 'My CVs',
        kanban: 'Kanban',
        subscription: 'Subscription',
        adminPanel: 'Admin Panel',
      },
      logout: {
        button: 'Log Out',
        confirm: 'Are you sure you want to log out?',
        yes: 'Yes, log out',
      },
      profile: {
        candidate: 'Candidate',
      },
    },
    dashboard: {
      banner: {
        title: 'Hello, {name}',
        desc: 'You are on the Free Plan. The free AI engine uses OpenRouter. Unlock professional templates and advanced AI integrations by upgrading your account.',
        upgrade: 'Upgrade to Pro (€10/mo)',
      },
      stats: {
        active: 'Active Applications',
        interview: 'In Interview Process',
        successful: 'Offers Received',
      },
      cvs: {
        title: 'Your Resumes',
        subtitle: 'Create your base resume, mark your primary or generate optimized copies.',
        primary: 'Primary: {title}',
        placeholder: 'Name of the new CV...',
        create: 'Create CV',
        generateAi: 'Generate with AI',
        empty: {
          title: "You don't have any resume yet",
          desc: 'Enter a title in the top right field and click "Create CV" to generate your first draft in Markdown. It will be automatically marked as primary!',
        },
        card: {
          base: 'Base',
          copy: 'Copy',
          primary: 'Primary',
          setPrimary: 'Set as Primary',
          template: 'Template',
          created: 'Created',
          edit: 'Edit CV',
          delete: 'Delete Resume',
        },
      },
      modal: {
        ai: {
          title: 'Smart AI Optimization',
          desc: 'We will generate a tailored resume based on your primary resume: ',
          building: 'Building your tailored resume',
          freeWarning: 'Attention: Free Plan Active',
          freeDesc: 'The free engine uses standard analysis. PRO members enjoy maximum semantic accuracy and drafting speed with more advanced AI models.',
          jobTitle: 'Job Title *',
          jobTitlePlaceholder: 'e.g. Frontend React Engineer',
          company: 'Company *',
          companyPlaceholder: 'e.g. Stripe',
          link: 'Job Offer Link',
          platform: 'Platform',
          platformOther: 'Other',
          mode: 'Smart Optimization Mode',
          defaultMode: 'Default (Harvard Style)',
          kanban: 'Automatically register in Kanban',
          kanbanDesc: 'If enabled, it will create a new application linked to this job offer in your Kanban board.',
          descLabel: 'Job Offer Description / Requirements *',
          descPlaceholder: 'Paste here the detailed description of the job offer, including the responsibilities and required skills.',
          close: 'Close',
          start: 'Start AI Optimization',
        },
      },
      alert: {
        primary: {
          title: 'Primary CV Required',
          msg: 'To generate a new customized resume with AI from the Dashboard, you must first set one of your resumes as primary.\n\nThis serves as a base with all your information for the AI to perform an excellent adaptation.\n\nYou can mark any of your resumes by clicking its star icon on the corresponding card.',
        },
        delete: {
          title: 'Delete Resume?',
          msg: 'This action cannot be undone and will permanently delete this resume from your account. If it is your primary resume, we will automatically reassign another of your base resumes as primary.',
          confirm: 'Yes, delete',
        },
      },
      steps: {
        keywords: 'Extracting keywords from the job offer...',
        analyze: 'Analyzing your experience and skills from the Primary CV...',
        align: 'Aligning your profile with key requirements...',
        generate: 'Generating optimized copy without losing the truth of the content...',
        create: 'Creating CV and registering application in Kanban...',
        success: 'Completed successfully! Redirecting...',
      },
      errors: {
        noPrimary: 'No primary CV has been designated.',
        required: 'The position, company, and job description are required.',
        unexpected: 'An unexpected error occurred.',
        createFail: 'Error creating resume.',
      },
      modes: {
        fidelity: {
          name: 'Fidelity Mode',
          desc: 'Absolute fidelity to your real background. Doesn\'t invent skills or tools; optimizes your wording and integrates keywords to pass ATS filters.',
        },
        performance: {
          name: 'Performance Mode',
          desc: 'Amplifies and realistically empowers your experience. If you master equivalent technologies, it integrates them strategically and optimizes ATS density.',
        },
        extreme: {
          name: 'Extreme Mode',
          desc: 'Absolute focus on passing the ATS filter. Adapts your CV and injects any technology or critical requirement demanded by the job offer for a 100% match.',
        },
        default: {
          desc: 'Optimize your resume according to the chosen job offer.',
        },
      },
    },
  },
} as const;

export type TranslationKeys = typeof translations.es;
