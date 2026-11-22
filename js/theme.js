(() => {
  const root = document.documentElement;
  const themeToggle = document.getElementById('theme-toggle');
  const languageToggle = document.getElementById('language-toggle');

  const copy = {
    fr: {
      metaDescription: 'Think Before You Design 2026 — CtrlArt, Faculté des Sciences Ben M’Sick, Casablanca.',
      brandHome: 'CtrlArt, retour à l’accueil',
      navigation: 'Navigation principale',
      nav: ['Accueil', 'Concept', 'Inscription', 'Contact'],
      contactPageNav: ['Accueil', 'Contact'],
      languageAction: 'Passer en anglais',
      themeLight: 'Passer au thème clair',
      themeDark: 'Passer au thème sombre',
      quickLink: 'Aller à l’inscription',
      heroDescription: 'Avant de créer, prenons le temps de penser. Deux journées pour explorer le design avec intention, curiosité et esprit créatif.',
      heroCta: 'Découvrir l’inscription',
      heroTagline: 'Une idée commence toujours quelque part.',
      heroScroll: 'Défiler pour découvrir ↓',
      registrationSection: 'Inscription à Think Before You Design 2026',
      videoLabel: 'Vidéo de présentation de Think Before You Design',
      brandPanel: 'Vidéo CtrlArt',
      previewBadge: 'Inscriptions ouvertes',
      required: 'Champs obligatoires',
      formTitle: 'Inscription',
      dateLine: 'Think Before You Design 2026 · 28 novembre et 5 décembre 2026',
      coverageLine: 'Une seule inscription couvre les deux journées',
      venueLine: 'Faculté des Sciences Ben M’Sick · Casablanca',
      fields: {
        prenom: 'Prénom',
        nom: 'Nom',
        email: 'Adresse e-mail',
        telephone: 'Téléphone',
        affiliation: 'Affiliation / statut (ex. filière ou spécialité)',
        etablissement: 'Établissement',
        faculte: 'Faculté / département'
      },
      placeholders: {
        prenom: 'Votre prénom',
        nom: 'Votre nom',
        email: 'Votre adresse e-mail',
        telephone: 'Votre numéro de téléphone',
        affiliation: 'Votre affiliation ou statut',
        etablissement: 'Votre établissement',
        faculte: 'Votre faculté ou département'
      },
      registrationSoon: 'Générer mon billet',
      previewNotice: 'Remplissez le formulaire pour générer et télécharger immédiatement votre billet nominatif avec QR code.',
      fsbmLogo: 'Logo de la Faculté des Sciences Ben M’Sick',
      ticket: {
        pageTitle: 'Aperçu du billet — Think Before You Design 2026 | CtrlArt',
        metaDescription: 'Aperçu de billet de démonstration pour Think Before You Design 2026, à Casablanca.',
        navigation: 'Navigation du billet', navHome: 'Accueil', navContact: 'Contact', homeAction: 'Retour à l’accueil',
        pageEyebrow: 'CTRLART × FSBM · CASABLANCA', heading: 'Think Before You Design', eventLabel: 'BILLET ÉVÉNEMENT · 2026',
        dateLabel: 'DATES', dates: '28 novembre & 5 décembre 2026', bothDays: 'Un seul billet · accès aux deux journées',
        venueLabel: 'LIEU', venue: 'Faculté des Sciences Ben M’Sick · Casablanca', attendeeLabel: 'PARTICIPANT·E', sampleName: '[Prénom Nom]',
        ticketNumberLabel: 'NUMÉRO DU BILLET', serialLabel: 'SÉRIE', capacity: 'Capacité limitée · 300 places',
        qrLabel: 'Code QR du billet de démonstration', qrCaption: 'Identité de démonstration encodée localement',
        stubHeading: 'À conserver', stubCopy: 'Ce billet unique couvre les deux dates de l’événement.',
        demoBadge: 'DÉMO · PAS UN VRAI BILLET', privacyTitle: 'Confidentialité du code QR',
        privacyWarning: 'Toute personne qui scanne ce code QR peut lire le nom, l’adresse e-mail et le numéro de téléphone qu’il contient.',
        footerNote: 'Aperçu uniquement · aucune inscription ni donnée n’est envoyée ou enregistrée.',
        ctrlartAlt: 'Logo CtrlArt', fsbmAlt: 'Logo de la Faculté des Sciences Ben M’Sick', injazAlt: 'Logo Injaz Al-Maghrib'
      },
      contact: {
        sectionLabel: 'Informations de contact de l’équipe CtrlArt',
        eyebrow: 'Équipe CtrlArt',
        title: 'Contact',
        intro: 'Une question sur l’événement ? Contactez directement l’équipe CtrlArt.',
        phoneLabel: 'Téléphone',
        emailLabel: 'E-mail',
        roleMouhssine: 'Directeur Stratégique du Projet & Marketing Strategist (Ancien Team Leader CtrlArt)',
        roleAbdelbasset: 'Team Leader CtrlArt & Directeur Artistique (Graphic Designer)',
        cardMouhssine: 'Coordonnées de Mouhssine Lamsiah',
        callMouhssine: 'Appeler Mouhssine Lamsiah',
        emailMouhssine: 'Envoyer un e-mail à Mouhssine Lamsiah',
        portraitMouhssine: 'Portrait de Mouhssine Lamsiah',
        cardAbdelbasset: 'Coordonnées d’Abdelbasset Tassine',
        callAbdelbasset: 'Appeler Abdelbasset Tassine',
        emailAbdelbasset: 'Envoyer un e-mail à Abdelbasset Tassine',
        portraitAbdelbasset: 'Portrait d’Abdelbasset Tassine'
      },
      organization: {
        pageTitle: 'Contact — CtrlArt & FSBM',
        metaDescription: 'Coordonnées de CtrlArt et de la Faculté des Sciences Ben M’Sick : réseaux sociaux, site web et e-mail.',
        sectionLabel: 'Coordonnées de CtrlArt et de la Faculté des Sciences Ben M’Sick',
        eyebrow: 'CTRLART × FSBM',
        title: 'Contact',
        intro: 'Retrouvez CtrlArt sur ses réseaux sociaux ou contactez la Faculté des Sciences Ben M’Sick.',
        ctrlartType: 'Club artistique et numérique',
        socialTitle: 'Réseaux sociaux',
        linkedinLabel: 'LinkedIn',
        linkedinName: 'Ctrl_Art_FSBM',
        linkedinAction: 'Rechercher Ctrl_Art_FSBM sur LinkedIn',
        instagramLabel: 'Instagram',
        instagramHandle: 'ctrlart_fsbm',
        instagramAction: 'Ouvrir le profil Instagram CtrlArt',
        fsbmName: 'Faculté des Sciences Ben M’Sick',
        websiteLabel: 'Site web',
        websiteValue: 'fsbm.ma',
        websiteAction: 'Visiter le site de la FSBM',
        emailLabel: 'E-mail',
        emailValue: 'fsbm.contact@univh2c.ma',
        emailAction: 'Envoyer un e-mail à la FSBM',
        homeCta: 'Retour à l’accueil',
        ctrlartAlt: 'Logo de CtrlArt',
        fsbmAlt: 'Logo de la Faculté des Sciences Ben M’Sick'
      }
    },
    en: {
      metaDescription: 'Think Before You Design 2026 — CtrlArt, Faculty of Sciences Ben M’Sick, Casablanca.',
      brandHome: 'CtrlArt, back to home',
      navigation: 'Main navigation',
      nav: ['Home', 'Concept', 'Registration', 'Contact'],
      contactPageNav: ['Home', 'Contact'],
      languageAction: 'Switch to French',
      themeLight: 'Switch to light theme',
      themeDark: 'Switch to dark theme',
      quickLink: 'Go to registration',
      heroDescription: 'Before we create, let’s take time to think. Two days to explore design with intention, curiosity, and a creative spirit.',
      heroCta: 'Discover registration',
      heroTagline: 'Every idea starts somewhere.',
      heroScroll: 'Scroll to discover ↓',
      registrationSection: 'Registration for Think Before You Design 2026',
      videoLabel: 'Think Before You Design event video',
      brandPanel: 'CtrlArt video',
      previewBadge: 'Registration open',
      required: 'Required fields',
      formTitle: 'Registration',
      dateLine: 'Think Before You Design 2026 · November 28 and December 5, 2026',
      coverageLine: 'One registration covers both days',
      venueLine: 'Faculty of Sciences Ben M’Sick · Casablanca',
      fields: {
        prenom: 'First name',
        nom: 'Last name',
        email: 'Email address',
        telephone: 'Phone',
        affiliation: 'Affiliation / status (e.g. program or major)',
        etablissement: 'Institution',
        faculte: 'Faculty / department'
      },
      placeholders: {
        prenom: 'Your first name',
        nom: 'Your last name',
        email: 'Your email address',
        telephone: 'Your phone number',
        affiliation: 'Your affiliation or status',
        etablissement: 'Your institution',
        faculte: 'Your faculty or department'
      },
      registrationSoon: 'Generate my ticket',
      previewNotice: 'Fill out the form to immediately generate and download your personal QR-code ticket.',
      fsbmLogo: 'Faculty of Sciences Ben M’Sick logo',
      ticket: {
        pageTitle: 'Ticket Preview — Think Before You Design 2026 | CtrlArt',
        metaDescription: 'Demo ticket preview for Think Before You Design 2026 in Casablanca.',
        navigation: 'Ticket page navigation', navHome: 'Home', navContact: 'Contact', homeAction: 'Back to home',
        pageEyebrow: 'CTRLART × FSBM · CASABLANCA', heading: 'Think Before You Design', eventLabel: 'EVENT TICKET · 2026',
        dateLabel: 'DATES', dates: 'November 28 & December 5, 2026', bothDays: 'One ticket · access to both days',
        venueLabel: 'VENUE', venue: 'Faculty of Sciences Ben M’Sick · Casablanca', attendeeLabel: 'ATTENDEE', sampleName: '[First name Last name]',
        ticketNumberLabel: 'TICKET NUMBER', serialLabel: 'SERIES', capacity: 'Limited capacity · 300 places',
        qrLabel: 'Demo ticket QR code', qrCaption: 'Demo identity encoded locally', stubHeading: 'Keep this part',
        stubCopy: 'This single ticket covers both event dates.', demoBadge: 'DEMO · NOT A REAL TICKET',
        privacyTitle: 'QR code privacy',
        privacyWarning: 'Anyone who scans this QR code can read the name, email address, and phone number it contains.',
        footerNote: 'Preview only · no registration or data is sent or stored.',
        ctrlartAlt: 'CtrlArt logo', fsbmAlt: 'Faculty of Sciences Ben M’Sick logo', injazAlt: 'Injaz Al-Maghrib logo'
      },
      contact: {
        sectionLabel: 'Contact information for the CtrlArt team',
        eyebrow: 'CtrlArt team',
        title: 'Contact',
        intro: 'Questions about the event? Get in touch with the CtrlArt team.',
        phoneLabel: 'Phone',
        emailLabel: 'Email',
        roleMouhssine: 'Strategic Project Director & Marketing Strategist (Former CtrlArt Team Leader)',
        roleAbdelbasset: 'CtrlArt Team Leader & Art Director (Graphic Designer)',
        cardMouhssine: 'Contact details for Mouhssine Lamsiah',
        callMouhssine: 'Call Mouhssine Lamsiah',
        emailMouhssine: 'Email Mouhssine Lamsiah',
        portraitMouhssine: 'Portrait of Mouhssine Lamsiah',
        cardAbdelbasset: 'Contact details for Abdelbasset Tassine',
        callAbdelbasset: 'Call Abdelbasset Tassine',
        emailAbdelbasset: 'Email Abdelbasset Tassine',
        portraitAbdelbasset: 'Portrait of Abdelbasset Tassine'
      },
      organization: {
        pageTitle: 'Contact — CtrlArt & FSBM',
        metaDescription: 'Contact details for CtrlArt and the Faculty of Sciences Ben M’Sick: social profiles, website and email.',
        sectionLabel: 'Contact details for CtrlArt and the Faculty of Sciences Ben M’Sick',
        eyebrow: 'CTRLART × FSBM',
        title: 'Contact',
        intro: 'Find CtrlArt on social media or contact the Faculty of Sciences Ben M’Sick.',
        ctrlartType: 'Arts and digital club',
        socialTitle: 'Social media',
        linkedinLabel: 'LinkedIn',
        linkedinName: 'Ctrl_Art_FSBM',
        linkedinAction: 'Search for Ctrl_Art_FSBM on LinkedIn',
        instagramLabel: 'Instagram',
        instagramHandle: 'ctrlart_fsbm',
        instagramAction: 'Open the CtrlArt Instagram profile',
        fsbmName: 'Faculty of Sciences Ben M’Sick',
        websiteLabel: 'Website',
        websiteValue: 'fsbm.ma',
        websiteAction: 'Visit the FSBM website',
        emailLabel: 'Email',
        emailValue: 'fsbm.contact@univh2c.ma',
        emailAction: 'Email the FSBM',
        homeCta: 'Back to home',
        ctrlartAlt: 'CtrlArt logo',
        fsbmAlt: 'Faculty of Sciences Ben M’Sick logo'
      }
    }
  };

  const setTextNode = (element, value) => {
    if (!element) return;
    const node = Array.from(element.childNodes).find(
      (child) => child.nodeType === Node.TEXT_NODE && child.textContent.trim()
    );
    if (node) node.textContent = `${value} `;
  };

  const applyThemeState = () => {
    if (!themeToggle) return;
    const isLight = root.dataset.theme === 'light';
    const language = root.lang === 'en' ? 'en' : 'fr';
    const themeLabel = isLight ? copy[language].themeDark : copy[language].themeLight;
    themeToggle.setAttribute('aria-pressed', String(isLight));
    themeToggle.setAttribute('aria-label', themeLabel);
    themeToggle.title = themeLabel;

    const themeColor = document.querySelector('meta[name="theme-color"]');
    if (themeColor) themeColor.content = isLight ? '#efebe4' : '#090909';
  };

  const applyLanguage = (language, persist = true) => {
    const selected = language === 'en' ? 'en' : 'fr';
    const strings = copy[selected];
    const registrationPrivacy = document.querySelector('[data-registration-privacy]');
    if (registrationPrivacy) registrationPrivacy.textContent = selected === 'en'
      ? 'Anyone who scans your ticket QR can see your full name, email address, and phone number; scanning does not require authentication.'
      : 'Toute personne qui scanne le QR de votre billet peut voir votre nom complet, votre adresse e-mail et votre numéro de téléphone ; le scan ne requiert aucune authentification.';
    root.lang = selected;
    const isOrganizationContact = root.dataset.page === 'organization-contact';
    const isTicketPage = root.dataset.page === 'ticket-preview';

    if (languageToggle) {
      languageToggle.textContent = selected.toUpperCase();
      languageToggle.lang = selected;
      languageToggle.setAttribute('aria-pressed', String(selected === 'en'));
      languageToggle.setAttribute('aria-label', strings.languageAction);
      languageToggle.title = strings.languageAction;
    }

    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) metaDescription.content = isOrganizationContact ? strings.organization.metaDescription : isTicketPage ? strings.ticket.metaDescription : strings.metaDescription;
    if (isOrganizationContact) document.title = strings.organization.pageTitle;
    if (isTicketPage) document.title = strings.ticket.pageTitle;

    const brand = document.querySelector('.header-brand');
    if (brand) brand.setAttribute('aria-label', strings.brandHome);
    const navigation = document.querySelector('.hero-nav');
    if (navigation) navigation.setAttribute('aria-label', strings.navigation);
    const navLabels = navigation?.dataset.page === 'organization-contact'
      ? strings.contactPageNav
      : navigation?.dataset.page === 'ticket-preview'
        ? [strings.ticket.navHome, strings.ticket.navContact]
        : strings.nav;
    document.querySelectorAll('.hero-nav a').forEach((link, index) => {
      if (navLabels[index]) link.textContent = navLabels[index];
    });

    const quickLink = document.querySelector('.quick-link');
    const quickLinkLabel = isOrganizationContact ? strings.organization.homeCta : strings.quickLink;
    if (quickLink) {
      quickLink.setAttribute('aria-label', quickLinkLabel);
      quickLink.title = quickLinkLabel;
    }
    const heroDescription = document.querySelector('.hero-description');
    if (heroDescription) heroDescription.textContent = strings.heroDescription;
    setTextNode(document.querySelector('.hero-cta'), strings.heroCta);
    const heroBottom = document.querySelector('.hero-bottom');
    if (heroBottom) {
      const tagline = heroBottom.querySelector('span');
      const scrollLink = heroBottom.querySelector('a');
      if (tagline) tagline.textContent = strings.heroTagline;
      if (scrollLink) scrollLink.textContent = strings.heroScroll;
    }

    const registration = document.querySelector('#inscription');
    if (registration) registration.setAttribute('aria-label', strings.registrationSection);
    const brandPanel = document.querySelector('.brand-panel');
    if (brandPanel) brandPanel.setAttribute('aria-label', strings.brandPanel);
    const video = document.querySelector('.brand-video');
    if (video) video.setAttribute('aria-label', strings.videoLabel);
    document.querySelectorAll('.header-fsbm-logo').forEach((logo) => {
      logo.alt = strings.fsbmLogo;
    });

    setTextNode(document.querySelector('.preview-badge'), strings.previewBadge);
    setTextNode(document.querySelector('.required-legend'), strings.required);
    const formTitle = document.querySelector('.form-title');
    if (formTitle) formTitle.textContent = strings.formTitle;
    const formSubtitle = document.querySelector('.form-subtitle');
    if (formSubtitle) {
      const lines = [strings.dateLine, strings.coverageLine, strings.venueLine];
      formSubtitle.replaceChildren();
      lines.forEach((line, index) => {
        if (index) formSubtitle.append(document.createElement('br'));
        formSubtitle.append(document.createTextNode(line));
      });
    }

    Object.entries(strings.fields).forEach(([id, label]) => {
      setTextNode(document.querySelector(`label[for="${id}"]`), label);
    });
    Object.entries(strings.placeholders).forEach(([id, placeholder]) => {
      const input = document.getElementById(id);
      if (input) input.placeholder = placeholder;
    });

    const submitText = document.querySelector('.submit-button > span:last-child');
    if (submitText) submitText.textContent = strings.registrationSoon;
    const noticeText = document.querySelector('.preview-notice > span:last-child');
    if (noticeText) noticeText.textContent = strings.previewNotice;

    const contactSection = document.querySelector('.contact-section');
    if (contactSection) {
      contactSection.setAttribute('aria-label', strings.contact.sectionLabel);
      contactSection.querySelectorAll('[data-contact-key]').forEach((element) => {
        element.textContent = strings.contact[element.dataset.contactKey];
      });
      contactSection.querySelectorAll('[data-contact-aria]').forEach((element) => {
        element.setAttribute('aria-label', strings.contact[element.dataset.contactAria]);
      });
      contactSection.querySelectorAll('[data-contact-alt]').forEach((element) => {
        element.alt = strings.contact[element.dataset.contactAlt];
      });
    }

    const organizationSection = document.querySelector('#organization-contact');
    if (organizationSection) {
      organizationSection.setAttribute('aria-label', strings.organization.sectionLabel);
      organizationSection.querySelectorAll('[data-org-key]').forEach((element) => {
        element.textContent = strings.organization[element.dataset.orgKey];
      });
      organizationSection.querySelectorAll('[data-org-aria]').forEach((element) => {
        element.setAttribute('aria-label', strings.organization[element.dataset.orgAria]);
      });
      organizationSection.querySelectorAll('[data-org-alt]').forEach((element) => {
        element.alt = strings.organization[element.dataset.orgAlt];
      });
    }

    const ticketPage = document.querySelector('[data-ticket-page]');
    if (ticketPage) {
      ticketPage.setAttribute('aria-label', strings.ticket.heading);
      ticketPage.querySelectorAll('[data-ticket-key]').forEach((element) => {
        const value = strings.ticket[element.dataset.ticketKey];
        if (value) element.textContent = value;
      });
      ticketPage.querySelectorAll('[data-ticket-alt]').forEach((element) => {
        const value = strings.ticket[element.dataset.ticketAlt];
        if (value) element.alt = value;
      });
      ticketPage.querySelectorAll('[data-ticket-key-aria]').forEach((element) => {
        const value = strings.ticket[element.dataset.ticketKeyAria];
        if (value) element.setAttribute('aria-label', value);
      });
      const ticketNav = document.querySelector('.ticket-header .hero-nav');
      if (ticketNav) ticketNav.setAttribute('aria-label', strings.ticket.navigation);
      const ticketHome = document.querySelector('.ticket-header .quick-link');
      if (ticketHome) {
        ticketHome.setAttribute('aria-label', strings.ticket.homeAction);
        ticketHome.title = strings.ticket.homeAction;
      }
    }

    applyThemeState();
    if (persist) {
      try {
        localStorage.setItem('ctrlart-language', selected);
      } catch (_) {
        // The language still changes for this page view if storage is unavailable.
      }
      document.dispatchEvent(new CustomEvent('ctrlart:language-change', { detail: { language: selected } }));
    }
  };

  let savedLanguage = root.lang === 'en' ? 'en' : 'fr';
  try {
    const storedLanguage = localStorage.getItem('ctrlart-language');
    if (storedLanguage === 'fr' || storedLanguage === 'en') savedLanguage = storedLanguage;
  } catch (_) {
    // Use French as the default if browser storage is unavailable.
  }
  applyLanguage(savedLanguage, false);

  if (languageToggle) {
    languageToggle.addEventListener('click', () => {
      applyLanguage(root.lang === 'en' ? 'fr' : 'en');
    });
  }

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      root.dataset.theme = root.dataset.theme === 'light' ? 'dark' : 'light';
      applyThemeState();
      try {
        localStorage.setItem('ctrlart-theme', root.dataset.theme);
      } catch (_) {
        // The theme still changes for this page view if storage is unavailable.
      }
    });
  }
})();
