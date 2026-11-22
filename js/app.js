(() => {
  'use strict';

  const CAPACITY = 300;
  const STORAGE_KEY = 'ctrlart_tbyd_2026_tickets_v1';

  const FIELD_NAMES = [
    'prenom',
    'nom',
    'email',
    'telephone',
    'affiliation',
    'etablissement',
    'faculte',
  ];

  const FIELD_LIMITS = {
    prenom: { min: 2, max: 80, label: 'first_name' },
    nom: { min: 2, max: 80, label: 'last_name' },
    affiliation: { min: 2, max: 120, label: 'affiliation' },
    etablissement: { min: 2, max: 140, label: 'institution' },
    faculte: { min: 2, max: 140, label: 'faculty' },
  };

  const form = document.querySelector('.registration-form');
  if (!form) return;

  const formActions = form.querySelector('.form-actions');
  const submitButton = form.querySelector('.submit-button');
  const noticeEl = document.getElementById('preview-notice');
  const badgeEl = document.querySelector('.preview-badge');

  const inputs = {};
  for (let i = 0; i < FIELD_NAMES.length; i += 1) {
    const name = FIELD_NAMES[i];
    const el = document.getElementById(name);
    if (el) {
      inputs[name] = el;
    }
  }

  let language = document.documentElement.lang === 'en' ? 'en' : 'fr';
  let noticeState = null;
  let currentTicket = null;
  let confirmationEl = null;

  const MESSAGES = {
    fr: {
      badge_open: 'Inscriptions ouvertes',
      badge_confirmed: 'Billet généré',
      submit_button: 'Générer mon billet',
      confirmed_button: 'Billet généré',
      new_ticket_button: 'Générer un autre billet',
      download_png: 'Télécharger le billet (PNG)',
      print_pdf: 'Imprimer / PDF',
      open_notice: 'Remplissez le formulaire pour générer et télécharger immédiatement votre billet nominatif avec QR code.',
      confirmed_notice: 'Billet généré avec succès ({id}). Téléchargez-le ou faites une capture d’écran avant l’événement.',
      already_notice: 'Un billet existe déjà sur cet appareil pour cette adresse e-mail ({id}). Voici votre billet.',
      form_incomplete: 'Le formulaire est incomplet. Rechargez la page.',
      forbidden_chars: 'Un champ contient des caractères non autorisés.',
      field_invalid: 'Veuillez saisir un champ « {field} » valide ({min} à {max} caractères).',
      email_invalid: 'Veuillez saisir une adresse e-mail valide.',
      phone_invalid: 'Veuillez saisir un numéro de téléphone valide (8 à 15 chiffres).',
      privacy_note: 'Confidentialité : le QR code contient votre nom complet, votre adresse e-mail et votre téléphone. Toute personne qui le scanne peut lire ces informations.',
      first_name: 'prénom',
      last_name: 'nom',
      affiliation: 'affiliation ou statut',
      institution: 'établissement',
      faculty: 'faculté ou département',
    },
    en: {
      badge_open: 'Registration open',
      badge_confirmed: 'Ticket generated',
      submit_button: 'Generate my ticket',
      confirmed_button: 'Ticket generated',
      new_ticket_button: 'Generate another ticket',
      download_png: 'Download ticket (PNG)',
      print_pdf: 'Print / PDF',
      open_notice: 'Fill out the form to immediately generate and download your personal QR-code ticket.',
      confirmed_notice: 'Ticket successfully generated ({id}). Download it or take a screenshot before the event.',
      already_notice: 'A ticket already exists on this device for this email address ({id}). Here is your ticket.',
      form_incomplete: 'The form is incomplete. Reload the page.',
      forbidden_chars: 'A field contains characters that are not allowed.',
      field_invalid: 'Enter a valid “{field}” ({min} to {max} characters).',
      email_invalid: 'Enter a valid email address.',
      phone_invalid: 'Enter a valid phone number (8 to 15 digits).',
      privacy_note: 'Privacy: the QR code contains your full name, email address, and phone number. Anyone who scans it can read this information.',
      first_name: 'first name',
      last_name: 'last name',
      affiliation: 'affiliation or status',
      institution: 'institution',
      faculty: 'faculty or department',
    },
  };

  function tr(key, values) {
    const template = MESSAGES[language][key] || MESSAGES.fr[key] || '';
    return template.replace(/\{([a-z]+)\}/g, (_match, name) =>
      values && values[name] !== undefined
        ? String(name === 'field' && values.fieldKey ? tr(values.fieldKey) : values[name])
        : '',
    );
  }

  function escapeHtml(value) {
    return String(value == null ? '' : value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function setFormFieldsState(enabled) {
    for (let i = 0; i < FIELD_NAMES.length; i += 1) {
      const el = inputs[FIELD_NAMES[i]];
      if (!el) continue;
      el.disabled = !enabled;
      el.readOnly = !enabled;
      if (enabled) {
        el.removeAttribute('aria-disabled');
      } else {
        el.setAttribute('aria-disabled', 'true');
      }
    }
  }

  function styleSubmitButton(enabled, labelKey) {
    if (!submitButton) return;
    submitButton.disabled = !enabled;
    const spans = submitButton.querySelectorAll('span');
    const labelSpan = spans.length > 0 ? spans[spans.length - 1] : submitButton;
    if (labelSpan && labelKey) {
      labelSpan.textContent = tr(labelKey);
    }
    if (enabled) {
      submitButton.removeAttribute('aria-disabled');
      submitButton.style.cursor = 'pointer';
      submitButton.style.opacity = '1';
      submitButton.style.borderStyle = 'solid';
      submitButton.style.borderColor = 'var(--accent, #c88762)';
      submitButton.style.color = '#f8fafc';
    } else {
      submitButton.setAttribute('aria-disabled', 'true');
      submitButton.style.cursor = 'not-allowed';
      submitButton.style.opacity = '0.72';
      submitButton.style.borderStyle = 'dashed';
      submitButton.style.borderColor = '';
      submitButton.style.color = '';
    }
  }

  function setBadgeLabel(key) {
    if (!badgeEl) return;
    const dot = badgeEl.querySelector('.preview-dot');
    while (badgeEl.firstChild) {
      badgeEl.removeChild(badgeEl.firstChild);
    }
    if (dot) badgeEl.appendChild(dot);
    badgeEl.appendChild(document.createTextNode(tr(key)));
  }

  function setNotice(key, tone, values) {
    if (!noticeEl) return;
    noticeState = { key, tone: tone || 'neutral', values: values || null };
    const spans = noticeEl.querySelectorAll('span');
    const target = spans.length >= 2 ? spans[spans.length - 1] : noticeEl;
    if (target) {
      target.textContent = tr(key, values);
    }
    if (tone === 'error') {
      noticeEl.style.borderColor = 'rgba(248, 113, 113, 0.45)';
      noticeEl.style.background = 'rgba(248, 113, 113, 0.08)';
    } else if (tone === 'success') {
      noticeEl.style.borderColor = 'rgba(52, 211, 153, 0.45)';
      noticeEl.style.background = 'rgba(52, 211, 153, 0.08)';
    } else {
      noticeEl.style.borderColor = '';
      noticeEl.style.background = '';
    }
  }

  function readAndValidateForm() {
    const payload = {};
    for (let i = 0; i < FIELD_NAMES.length; i += 1) {
      const key = FIELD_NAMES[i];
      const el = inputs[key];
      if (!el) return { ok: false, messageKey: 'form_incomplete' };
      const rawValue = typeof el.value === 'string' ? el.value : '';
      if (/[\u0000-\u001F\u007F]/.test(rawValue)) {
        return { ok: false, field: el, messageKey: 'forbidden_chars' };
      }
      payload[key] = rawValue.trim().replace(/\s+/g, ' ');
    }

    const textFields = ['prenom', 'nom', 'affiliation', 'etablissement', 'faculte'];
    for (let i = 0; i < textFields.length; i += 1) {
      const key = textFields[i];
      const rules = FIELD_LIMITS[key];
      const val = payload[key];
      if (val.length < rules.min || val.length > rules.max) {
        return {
          ok: false,
          field: inputs[key],
          messageKey: 'field_invalid',
          messageValues: { fieldKey: rules.label, field: tr(rules.label), min: rules.min, max: rules.max },
        };
      }
    }

    const emailNormalized = payload.email.toLowerCase();
    if (
      emailNormalized.length < 5 ||
      emailNormalized.length > 254 ||
      !/^[a-z0-9][a-z0-9._%+-]{0,63}@[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?(?:\.[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?)+$/.test(emailNormalized) ||
      emailNormalized.indexOf('..') !== -1
    ) {
      return { ok: false, field: inputs.email, messageKey: 'email_invalid' };
    }
    payload.email = emailNormalized;

    const phone = payload.telephone;
    const phoneDigits = phone.replace(/\D/g, '');
    const plusMatches = phone.match(/\+/g);
    if (
      phone.length < 8 ||
      phone.length > 30 ||
      !/^[+0-9()\s.-]+$/.test(phone) ||
      (plusMatches && (plusMatches.length > 1 || phone.charAt(0) !== '+')) ||
      phoneDigits.length < 8 ||
      phoneDigits.length > 15
    ) {
      return { ok: false, field: inputs.telephone, messageKey: 'phone_invalid' };
    }

    return { ok: true, payload };
  }

  function loadStoredTickets() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch (_e) {
      return [];
    }
  }

  function saveStoredTickets(tickets) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tickets));
    } catch (_e) {
      // Non-blocking if storage is unavailable
    }
  }

  function createTicketRecord(payload) {
    const existingList = loadStoredTickets();
    const existing = existingList.find((item) => item && item.email === payload.email);
    if (existing) {
      return { record: existing, alreadyExisted: true };
    }

    const now = new Date();
    const randPart = String(Math.floor(100 + Math.random() * 900));
    const serialNum = Math.min(CAPACITY, existingList.length + 1);
    const serialStr = String(serialNum).padStart(3, '0');
    const ticketId = `CTRLART-2026-${serialStr}-${randPart}`;

    const record = {
      ticketId,
      serial: serialStr,
      fullName: `${payload.prenom} ${payload.nom}`.trim(),
      prenom: payload.prenom,
      nom: payload.nom,
      email: payload.email,
      telephone: payload.telephone,
      affiliation: payload.affiliation,
      etablissement: payload.etablissement,
      faculte: payload.faculte,
      createdAt: now.toISOString(),
    };

    existingList.push(record);
    saveStoredTickets(existingList);
    return { record, alreadyExisted: false };
  }

  function buildQrPayload(record) {
    return [
      `Billet/Ticket : ${record.serial}/${CAPACITY}`,
      `Réf/Ref : ${record.ticketId}`,
      `Nom/Name : ${record.fullName}`,
      `E-mail/Email : ${record.email}`,
      `Tél/Phone : ${record.telephone}`,
      `Établissement : ${record.etablissement}`,
    ].join('\n');
  }

  function drawQrToCanvas(canvas, text) {
    const qrLib = window.qrcodegen;
    if (!qrLib || !qrLib.QrCode) return;
    const qr = qrLib.QrCode.encodeText(String(text), qrLib.QrCode.Ecc.LOW);
    const quietZone = 4;
    const scale = 6;
    const size = (qr.size + quietZone * 2) * scale;
    canvas.width = size;
    canvas.height = size;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, size, size);
    ctx.fillStyle = '#111111';
    for (let y = 0; y < qr.size; y += 1) {
      for (let x = 0; x < qr.size; x += 1) {
        if (qr.getModule(x, y)) {
          ctx.fillRect((x + quietZone) * scale, (y + quietZone) * scale, scale, scale);
        }
      }
    }
  }

  async function downloadTicketAsPng(record, qrCanvas) {
    const width = 880;
    const height = 1480;
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 4;
    ctx.strokeRect(2, 2, width - 4, height - 4);

    const loadImg = (src) => new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => resolve(null);
      img.src = src;
    });

    const [ctrlartImg, injazImg, fsbmImg] = await Promise.all([
      loadImg('assets/logos/ctrlart-logo-black.png'),
      loadImg('assets/logos/injaz-logo.png'),
      loadImg('assets/logos/fsbm-logo-light.png'),
    ]);

    const logos = [ctrlartImg, injazImg, fsbmImg];
    logos.forEach((img, idx) => {
      if (!img) return;
      const boxW = 210;
      const boxH = 84;
      const ratio = Math.min(boxW / img.width, boxH / img.height);
      const drawW = img.width * ratio;
      const drawH = img.height * ratio;
      const cx = (width / 3) * idx + (width / 6);
      const cy = 84;
      ctx.drawImage(img, cx - drawW / 2, cy - drawH / 2, drawW, drawH);
    });

    const bannerTop = 165;
    const bannerH = 420;
    ctx.fillStyle = '#080808';
    ctx.fillRect(0, bannerTop, width, bannerH);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = '700 20px Arial, sans-serif';
    ctx.fillText('CTRLART  ·  ÉDITION 2026', width / 2, bannerTop + 56);

    ctx.font = '700 66px Georgia, serif';
    ctx.fillText('THINK BEFORE', width / 2, bannerTop + 148);
    ctx.fillText('YOU DESIGN', width / 2, bannerTop + 218);

    ctx.font = '400 22px Arial, sans-serif';
    ctx.fillText('UNE INSCRIPTION  ·  DEUX JOURNÉES', width / 2, bannerTop + 276);
    ctx.fillText('ONE REGISTRATION  ·  TWO DAYS', width / 2, bannerTop + 306);

    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2 - 60, bannerTop + 334);
    ctx.lineTo(width / 2 + 60, bannerTop + 334);
    ctx.stroke();

    ctx.font = '700 38px Arial, sans-serif';
    ctx.fillText(`${record.serial} / ${CAPACITY}`, width / 2, bannerTop + 388);

    const metaTop = bannerTop + bannerH + 46;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#666666';
    ctx.font = '700 18px Arial, sans-serif';
    ctx.fillText('DATES · DATES', 48, metaTop);
    ctx.fillText('LIEU · PLACE', width / 2 + 24, metaTop);

    ctx.strokeStyle = '#d5d5d5';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(width / 2, metaTop - 16);
    ctx.lineTo(width / 2, metaTop + 135);
    ctx.stroke();

    ctx.fillStyle = '#111111';
    ctx.font = '700 24px Georgia, serif';
    ctx.fillText('28 NOVEMBRE 2026', 48, metaTop + 36);
    ctx.fillText('5 DÉCEMBRE 2026', 48, metaTop + 68);
    ctx.font = '400 20px Arial, sans-serif';
    ctx.fillStyle = '#333333';
    ctx.fillText('NOVEMBER 28 & DEC 5, 2026', 48, metaTop + 102);

    ctx.fillStyle = '#111111';
    ctx.font = '700 22px Georgia, serif';
    ctx.fillText('Faculté des Sciences', width / 2 + 24, metaTop + 36);
    ctx.fillText('Ben M’Sik · BUMS', width / 2 + 24, metaTop + 66);
    ctx.font = '400 20px Arial, sans-serif';
    ctx.fillStyle = '#333333';
    ctx.fillText('Casablanca, Maroc', width / 2 + 24, metaTop + 102);

    const stubTop = metaTop + 170;
    ctx.save();
    ctx.setLineDash([12, 10]);
    ctx.strokeStyle = '#888888';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.moveTo(0, stubTop);
    ctx.lineTo(width, stubTop);
    ctx.stroke();
    ctx.restore();

    ctx.fillStyle = '#666666';
    ctx.font = '700 18px Arial, sans-serif';
    ctx.fillText('TITULAIRE · HOLDER', 48, stubTop + 48);

    ctx.fillStyle = '#111111';
    ctx.font = '700 34px Georgia, serif';
    ctx.fillText(record.fullName.slice(0, 34), 48, stubTop + 92);

    ctx.fillStyle = '#666666';
    ctx.font = '700 18px Arial, sans-serif';
    ctx.fillText('RÉFÉRENCE · REFERENCE', 48, stubTop + 146);

    ctx.fillStyle = '#111111';
    ctx.font = '700 24px Arial, sans-serif';
    ctx.fillText(record.ticketId, 48, stubTop + 182);

    const qrSize = 380;
    const qrX = (width - qrSize) / 2;
    const qrY = stubTop + 215;
    ctx.strokeStyle = '#111111';
    ctx.lineWidth = 3;
    ctx.strokeRect(qrX - 10, qrY - 10, qrSize + 20, qrSize + 20);
    ctx.drawImage(qrCanvas, qrX, qrY, qrSize, qrSize);

    ctx.textAlign = 'center';
    ctx.fillStyle = '#222222';
    ctx.font = '700 17px Arial, sans-serif';
    ctx.fillText('SCAN · NOM/NAME · E-MAIL · PHONE', width / 2, qrY + qrSize + 40);

    const link = document.createElement('a');
    link.download = `${record.ticketId}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
  }

  function renderTicketCard(record) {
    if (!formActions) return;
    if (confirmationEl && confirmationEl.parentNode) {
      confirmationEl.parentNode.removeChild(confirmationEl);
    }

    const wrapper = document.createElement('div');
    wrapper.className = 'ticket-confirmation-card';
    wrapper.id = 'ticket-printable-area';
    wrapper.setAttribute('role', 'region');
    wrapper.setAttribute('aria-live', 'polite');

    wrapper.innerHTML = `
      <div class="ticket-card-logos">
        <img src="assets/logos/ctrlart-logo-black.png" alt="CtrlArt" />
        <img src="assets/logos/injaz-logo.png" alt="INJAZ Al-Maghrib" />
        <img src="assets/logos/fsbm-logo-light.png" alt="FSBM — UH2C" />
      </div>
      <div class="ticket-card-hero">
        <div class="ticket-card-edition">CTRLART · ÉDITION 2026</div>
        <h3 class="ticket-card-title">THINK BEFORE<br>YOU DESIGN</h3>
        <div class="ticket-card-sub">UNE INSCRIPTION · DEUX JOURNÉES<br>ONE REGISTRATION · TWO DAYS</div>
        <div class="ticket-card-rule"></div>
        <div class="ticket-card-serial">${escapeHtml(record.serial)} <span>/ ${CAPACITY}</span></div>
      </div>
      <div class="ticket-card-meta">
        <div class="ticket-card-grid">
          <div>
            <div class="ticket-card-label">DATES · DATES</div>
            <div class="ticket-card-val">
              28 NOVEMBRE 2026<br>5 DÉCEMBRE 2026
              <span>NOVEMBER 28 &amp; DECEMBER 5, 2026</span>
            </div>
          </div>
          <div class="ticket-card-col--right">
            <div class="ticket-card-label">LIEU · PLACE</div>
            <div class="ticket-card-val">
              FSBM &amp; BUMS<br>Casablanca
              <span>Faculté des Sciences Ben M’Sik</span>
            </div>
          </div>
        </div>
        <div class="ticket-card-note">
          Une seule inscription couvre les deux journées. / One registration covers both days.
        </div>
      </div>
      <div class="ticket-card-stub">
        <div class="ticket-card-label">TITULAIRE · HOLDER</div>
        <div class="ticket-card-holder-name">${escapeHtml(record.fullName)}</div>
        <div class="ticket-card-label" style="margin-top:12px;">RÉFÉRENCE · REFERENCE</div>
        <div class="ticket-card-ref">${escapeHtml(record.ticketId)}</div>
        <div class="ticket-card-qr-wrap">
          <canvas id="ticket-qr-canvas"></canvas>
          <div class="ticket-card-scan-caption">SCAN · NOM/NAME · E-MAIL · PHONE</div>
        </div>
        <div class="ticket-card-privacy">${escapeHtml(tr('privacy_note'))}</div>
        <div class="ticket-card-actions">
          <button type="button" class="ticket-action-btn" data-ticket-download>${escapeHtml(tr('download_png'))}</button>
          <button type="button" class="ticket-action-btn ticket-action-btn--secondary" data-ticket-print>${escapeHtml(tr('print_pdf'))}</button>
        </div>
      </div>
    `;

    if (noticeEl && noticeEl.parentNode === formActions) {
      formActions.insertBefore(wrapper, noticeEl);
    } else {
      formActions.appendChild(wrapper);
    }
    confirmationEl = wrapper;

    const qrCanvas = wrapper.querySelector('#ticket-qr-canvas');
    if (qrCanvas) {
      drawQrToCanvas(qrCanvas, buildQrPayload(record));
    }

    const dlBtn = wrapper.querySelector('[data-ticket-download]');
    if (dlBtn && qrCanvas) {
      dlBtn.addEventListener('click', () => downloadTicketAsPng(record, qrCanvas));
    }

    const printBtn = wrapper.querySelector('[data-ticket-print]');
    if (printBtn) {
      printBtn.addEventListener('click', () => window.print());
    }
  }

  function handleGenerateTicket() {
    const validation = readAndValidateForm();
    if (!validation.ok) {
      setNotice(validation.messageKey, 'error', validation.messageValues);
      if (validation.field && typeof validation.field.focus === 'function') {
        validation.field.focus();
      }
      return;
    }

    const { record, alreadyExisted } = createTicketRecord(validation.payload);
    currentTicket = record;
    setBadgeLabel('badge_confirmed');
    renderTicketCard(record);
    setNotice(
      alreadyExisted ? 'already_notice' : 'confirmed_notice',
      'success',
      { id: record.ticketId },
    );
    if (confirmationEl && typeof confirmationEl.scrollIntoView === 'function') {
      confirmationEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }

  function init() {
    setBadgeLabel('badge_open');
    setFormFieldsState(true);
    styleSubmitButton(true, 'submit_button');
    setNotice('open_notice', 'neutral');

    if (submitButton) {
      submitButton.addEventListener('click', handleGenerateTicket);
    }

    for (let i = 0; i < FIELD_NAMES.length; i += 1) {
      const el = inputs[FIELD_NAMES[i]];
      if (!el) continue;
      el.addEventListener('keydown', (event) => {
        if (event.key === 'Enter') {
          event.preventDefault();
          handleGenerateTicket();
        }
      });
    }

    document.addEventListener('ctrlart:language-change', (event) => {
      const nextLang = event && event.detail && event.detail.language;
      if ((nextLang !== 'fr' && nextLang !== 'en') || nextLang === language) return;
      language = nextLang;
      setBadgeLabel(currentTicket ? 'badge_confirmed' : 'badge_open');
      styleSubmitButton(true, 'submit_button');
      if (currentTicket) renderTicketCard(currentTicket);
      if (noticeState) setNotice(noticeState.key, noticeState.tone, noticeState.values);
    });
  }

  init();
})();
