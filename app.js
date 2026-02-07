// ============================================================
// I18n Module — Internationalization (pt/en)
// ============================================================
const I18n = {
    locale: "pt",

    strings: {
        pt: {
            appTitle: "Diário da Gratidão",
            appSubtitle: "Registre diariamente seus motivos de gratidão",
            loginGoogle: "Entrar com Google",
            exportTooltip: "Exportar",
            logoutTooltip: "Sair",
            deleteTooltip: "Apagar entrada",
            weekdaysShort: "Dom,Seg,Ter,Qua,Qui,Sex,Sáb",
            entryLabel: "Pelo que você é grato(a) hoje?",
            entryPlaceholder: "Escreva um motivo por linha...",
            cancel: "Cancelar",
            save: "Salvar",
            exportTitle: "Exportar Gratidão",
            dateStart: "Data início",
            dateEnd: "Data fim",
            emailLabel: "Email destinatário",
            downloadTXT: "Baixar TXT",
            sendEmail: "Enviar por Email",
            months: "Janeiro,Fevereiro,Março,Abril,Maio,Junho,Julho,Agosto,Setembro,Outubro,Novembro,Dezembro",
            weekdays: "Domingo,Segunda-feira,Terça-feira,Quarta-feira,Quinta-feira,Sexta-feira,Sábado",
            weekdaysTXT: "Domingo,Segunda-Feira,Terça-Feira,Quarta-Feira,Quinta-Feira,Sexta-Feira,Sábado",
            loginError: "Erro ao fazer login. Tente novamente.",
            confirmDelete: "Tem certeza que deseja apagar esta entrada?",
            noEntries: "Nenhuma entrada para exportar.",
            selectDates: "Selecione as datas de início e fim.",
            invalidDateRange: "A data de início deve ser anterior à data de fim.",
            noEntriesInRange: "Nenhuma entrada encontrada no período selecionado.",
            enterEmail: "Digite o email do destinatário.",
            txtHeader: "Lista de Gratidão de {0} até {1}:",
            emailSubject: "Lista de Gratidão de {0} até {1}",
            dateDisplayFormat: "{day} de {month} de {year}",
            emailHelpTooltip: "Configurar email",
            emailHelpTitle: "Como configurar o mailto no Windows para abrir o Gmail no Chrome",
            emailHelpStep1Title: "1. Definir o Chrome como navegador padrão",
            emailHelpStep1: "Abra <strong>Configurações do Windows</strong> &rarr; <strong>Aplicativos</strong> &rarr; <strong>Aplicativos padrão</strong>. Em <strong>Navegador da Web</strong>, escolha <strong>Google Chrome</strong>.",
            emailHelpStep2Title: "2. Ativar o Gmail como manipulador de email no Chrome",
            emailHelpStep2: "Abra o Chrome e acesse <strong>mail.google.com</strong>. Faça login na sua conta. Na barra de endereço, procure o ícone de losango com um envelope (lado direito). Clique nele e selecione <strong>Permitir</strong>. Confirme o Gmail como aplicativo padrão para links de email.",
            emailHelpClose: "Entendi"
        },
        en: {
            appTitle: "Gratitude Journal",
            appSubtitle: "Record your daily reasons for gratitude",
            loginGoogle: "Sign in with Google",
            exportTooltip: "Export",
            logoutTooltip: "Sign out",
            deleteTooltip: "Delete entry",
            weekdaysShort: "Sun,Mon,Tue,Wed,Thu,Fri,Sat",
            entryLabel: "What are you grateful for today?",
            entryPlaceholder: "Write one reason per line...",
            cancel: "Cancel",
            save: "Save",
            exportTitle: "Export Gratitude Journal",
            dateStart: "Start date",
            dateEnd: "End date",
            emailLabel: "Recipient email",
            downloadTXT: "Download TXT",
            sendEmail: "Send by Email",
            months: "January,February,March,April,May,June,July,August,September,October,November,December",
            weekdays: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
            weekdaysTXT: "Sunday,Monday,Tuesday,Wednesday,Thursday,Friday,Saturday",
            loginError: "Login failed. Please try again.",
            confirmDelete: "Are you sure you want to delete this entry?",
            noEntries: "No entries to export.",
            selectDates: "Please select start and end dates.",
            invalidDateRange: "Start date must be before end date.",
            noEntriesInRange: "No entries found in the selected period.",
            enterEmail: "Enter the recipient email.",
            txtHeader: "Gratitude List from {0} to {1}:",
            emailSubject: "Gratitude List from {0} to {1}",
            dateDisplayFormat: "{month} {day}, {year}",
            emailHelpTooltip: "Email setup",
            emailHelpTitle: "How to set up mailto on Windows to open Gmail in Chrome",
            emailHelpStep1Title: "1. Set Chrome as your default browser",
            emailHelpStep1: "Open <strong>Windows Settings</strong> &rarr; <strong>Apps</strong> &rarr; <strong>Default apps</strong>. Under <strong>Web browser</strong>, choose <strong>Google Chrome</strong>.",
            emailHelpStep2Title: "2. Enable Gmail as the email handler in Chrome",
            emailHelpStep2: "Open Chrome and go to <strong>mail.google.com</strong>. Sign in to your account. In the address bar, look for a diamond icon with an envelope (right side). Click it and select <strong>Allow</strong>. Confirm Gmail as the default app for email links.",
            emailHelpClose: "Got it"
        }
    },

    init() {
        const lang = navigator.language || "pt";
        this.locale = lang.startsWith("en") ? "en" : "pt";
        document.documentElement.lang = this.locale === "en" ? "en" : "pt-BR";
        this.applyToDOM();
    },

    t(key) {
        return this.strings[this.locale][key] || this.strings["pt"][key] || key;
    },

    applyToDOM() {
        document.querySelectorAll("[data-i18n]").forEach(el => {
            el.textContent = this.t(el.getAttribute("data-i18n"));
        });
        document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
            el.placeholder = this.t(el.getAttribute("data-i18n-placeholder"));
        });
        document.querySelectorAll("[data-i18n-title]").forEach(el => {
            el.title = this.t(el.getAttribute("data-i18n-title"));
        });
        document.querySelectorAll("[data-i18n-html]").forEach(el => {
            el.innerHTML = this.t(el.getAttribute("data-i18n-html"));
        });
        // Update weekday headers in calendar
        const weekdayCont = document.querySelector(".calendar-weekdays");
        if (weekdayCont) {
            const days = this.t("weekdaysShort").split(",");
            const spans = weekdayCont.querySelectorAll("span");
            spans.forEach((span, i) => {
                if (days[i]) span.textContent = days[i];
            });
        }
    }
};

// ============================================================
// Auth Module
// ============================================================
const Auth = {
    currentUser: null,

    init() {
        auth.onAuthStateChanged(user => {
            Auth.currentUser = user;
            if (user) {
                document.getElementById("login-screen").classList.add("hidden");
                document.getElementById("app-screen").classList.remove("hidden");
                Calendar.load();
                Router.check();
            } else {
                document.getElementById("login-screen").classList.remove("hidden");
                document.getElementById("app-screen").classList.add("hidden");
            }
        });
    },

    login() {
        const provider = new firebase.auth.GoogleAuthProvider();
        auth.signInWithPopup(provider).catch(err => {
            console.error("Login error:", err);
            alert(I18n.t("loginError"));
        });
    },

    logout() {
        auth.signOut();
    }
};

// ============================================================
// DB Module — Firestore CRUD
// ============================================================
const DB = {
    _entriesRef() {
        return db.collection("users").doc(Auth.currentUser.uid).collection("entries");
    },

    async save(dateStr, content) {
        await this._entriesRef().doc(dateStr).set({
            content: content,
            date: dateStr
        });
    },

    async load(dateStr) {
        const doc = await this._entriesRef().doc(dateStr).get();
        return doc.exists ? doc.data().content : "";
    },

    async remove(dateStr) {
        await this._entriesRef().doc(dateStr).delete();
    },

    async loadMonth(year, month) {
        const start = `${year}-${String(month + 1).padStart(2, "0")}-01`;
        const endMonth = month + 1 > 11 ? 0 : month + 1;
        const endYear = month + 1 > 11 ? year + 1 : year;
        const end = `${endYear}-${String(endMonth + 1).padStart(2, "0")}-01`;

        const snapshot = await this._entriesRef()
            .where("date", ">=", start)
            .where("date", "<", end)
            .get();

        const entries = {};
        snapshot.forEach(doc => {
            entries[doc.id] = doc.data().content;
        });
        return entries;
    },

    async loadAll() {
        const snapshot = await this._entriesRef().orderBy("date", "desc").get();
        const entries = [];
        snapshot.forEach(doc => {
            entries.push({ date: doc.data().date, content: doc.data().content });
        });
        return entries;
    },

    async loadRange(startDate, endDate) {
        const snapshot = await this._entriesRef()
            .where("date", ">=", startDate)
            .where("date", "<=", endDate)
            .orderBy("date", "asc")
            .get();

        const entries = [];
        snapshot.forEach(doc => {
            entries.push({ date: doc.data().date, content: doc.data().content });
        });
        return entries;
    }
};

// ============================================================
// Calendar Module
// ============================================================
const Calendar = {
    year: new Date().getFullYear(),
    month: new Date().getMonth(),
    entries: {},

    async load() {
        this.entries = await DB.loadMonth(this.year, this.month);
        this.render();
    },

    render() {
        const title = document.getElementById("calendar-title");
        const grid = document.getElementById("calendar-grid");

        const monthNames = I18n.t("months").split(",");
        title.textContent = `${monthNames[this.month]} ${this.year}`;

        const firstDay = new Date(this.year, this.month, 1).getDay();
        const daysInMonth = new Date(this.year, this.month + 1, 0).getDate();
        const today = new Date();

        grid.innerHTML = "";

        // Empty cells for offset
        for (let i = 0; i < firstDay; i++) {
            const empty = document.createElement("div");
            empty.className = "calendar-day empty";
            grid.appendChild(empty);
        }

        // Day cells
        for (let d = 1; d <= daysInMonth; d++) {
            const btn = document.createElement("button");
            btn.className = "calendar-day";
            btn.textContent = d;

            const dateStr = `${this.year}-${String(this.month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;

            if (this.entries[dateStr]) {
                btn.classList.add("has-entry");
                const lines = this.entries[dateStr].split("\n").filter(l => l.trim()).length;
                const dotCount = Math.min(lines, 5);
                const dots = document.createElement("span");
                dots.className = "entry-dots";
                for (let i = 0; i < dotCount; i++) {
                    const dot = document.createElement("span");
                    dot.className = "entry-dot";
                    dots.appendChild(dot);
                }
                btn.appendChild(dots);
            }

            if (
                today.getFullYear() === this.year &&
                today.getMonth() === this.month &&
                today.getDate() === d
            ) {
                btn.classList.add("today");
            }

            btn.addEventListener("click", () => EntryForm.open(dateStr));
            grid.appendChild(btn);
        }
    },

    prev() {
        this.month--;
        if (this.month < 0) {
            this.month = 11;
            this.year--;
        }
        this.load();
    },

    next() {
        this.month++;
        if (this.month > 11) {
            this.month = 0;
            this.year++;
        }
        this.load();
    }
};

// ============================================================
// EntryForm Module — Modal editor
// ============================================================
const EntryForm = {
    currentDate: null,

    async open(dateStr) {
        this.currentDate = dateStr;

        const modal = document.getElementById("entry-modal");
        const textarea = document.getElementById("entry-textarea");
        const dateDisplay = document.getElementById("modal-date");
        const weekdayDisplay = document.getElementById("modal-weekday");

        // Format date for display
        const [y, m, d] = dateStr.split("-");
        const monthNames = I18n.t("months").split(",");
        const monthName = monthNames[parseInt(m) - 1];
        const day = parseInt(d);
        dateDisplay.textContent = I18n.t("dateDisplayFormat")
            .replace("{day}", day)
            .replace("{month}", monthName)
            .replace("{year}", y);

        // Show day of the week
        const weekdays = I18n.t("weekdays").split(",");
        const dateObj = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        weekdayDisplay.textContent = weekdays[dateObj.getDay()];

        textarea.value = await DB.load(dateStr);
        modal.classList.remove("hidden");
        textarea.focus();
    },

    close() {
        document.getElementById("entry-modal").classList.add("hidden");
        this.currentDate = null;
    },

    async save() {
        if (!this.currentDate) return;

        const content = document.getElementById("entry-textarea").value.trim();
        if (content) {
            await DB.save(this.currentDate, content);
        } else {
            await DB.remove(this.currentDate);
        }

        this.close();
        Calendar.load();
    },

    async remove() {
        if (!this.currentDate) return;
        if (!confirm(I18n.t("confirmDelete"))) return;
        await DB.remove(this.currentDate);
        this.close();
        Calendar.load();
    }
};

// ============================================================
// CSVExport Module
// ============================================================
const CSVExport = {
    async download() {
        const entries = await DB.loadAll(); // already sorted desc by date

        if (entries.length === 0) {
            alert(I18n.t("noEntries"));
            return;
        }

        let csv = "entryDate,entryContent\n";

        for (const entry of entries) {
            // Format date as M/D/YYYY 12:00:00 AM (InvariantCulture)
            const [y, m, d] = entry.date.split("-");
            const month = parseInt(m, 10);
            const day = parseInt(d, 10);
            const dateFormatted = `${month}/${day}/${y} 12:00:00 AM`;

            // Escape content: wrap in quotes if it contains newlines or commas
            let content = entry.content;
            if (content.includes("\n") || content.includes(",") || content.includes('"')) {
                content = '"' + content.replace(/"/g, '""') + '"';
            }

            csv += dateFormatted + "," + content + "\n";
        }

        const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "presently-backup.csv";
        a.click();
        URL.revokeObjectURL(url);
    }
};

// ============================================================
// TXTExport Module
// ============================================================
const TXTExport = {
    openModal() {
        const modal = document.getElementById("export-modal");
        const startInput = document.getElementById("export-date-start");
        const endInput = document.getElementById("export-date-end");

        // Default: first and last day of current month
        const now = new Date();
        const firstDay = new Date(now.getFullYear(), now.getMonth(), 1);
        const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0);

        startInput.value = this._toISO(firstDay);
        endInput.value = this._toISO(lastDay);

        modal.classList.remove("hidden");
    },

    closeModal() {
        document.getElementById("export-modal").classList.add("hidden");
        document.getElementById("export-email-field").classList.add("hidden");
        document.getElementById("export-email").value = "";
    },

    _toISO(date) {
        const y = date.getFullYear();
        const m = String(date.getMonth() + 1).padStart(2, "0");
        const d = String(date.getDate()).padStart(2, "0");
        return `${y}-${m}-${d}`;
    },

    _formatDate(dateStr) {
        const [y, m, d] = dateStr.split("-");
        return I18n.locale === "en" ? `${m}/${d}/${y}` : `${d}/${m}/${y}`;
    },

    _getWeekdayShort(dateStr) {
        const [y, m, d] = dateStr.split("-");
        const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        const shorts = I18n.t("weekdaysShort").split(",");
        return shorts[date.getDay()];
    },

    _buildFilename(startDate, endDate) {
        const [sy, sm, sd] = startDate.split("-");
        const [ey, em, ed] = endDate.split("-");
        if (I18n.locale === "en") {
            return `gratitude-list-${sm}-${sd}-${sy}--${em}-${ed}-${ey}.txt`;
        }
        return `lista-gratidao-${sd}-${sm}-${sy}--${ed}-${em}-${ey}.txt`;
    },

    _getWeekdayName(dateStr) {
        const [y, m, d] = dateStr.split("-");
        const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d));
        const weekdays = I18n.t("weekdaysTXT").split(",");
        return weekdays[date.getDay()];
    },

    generateText(entries, startDate, endDate) {
        const startFmt = `${this._formatDate(startDate)} (${this._getWeekdayShort(startDate)})`;
        const endFmt = `${this._formatDate(endDate)} (${this._getWeekdayShort(endDate)})`;

        let text = I18n.t("txtHeader").replace("{0}", startFmt).replace("{1}", endFmt) + "\r\n\r\n";

        for (const entry of entries) {
            const weekday = this._getWeekdayName(entry.date);
            const dateFmt = this._formatDate(entry.date);

            text += `_______________________________________________________\r\n\r\n`;
            text += `${weekday} (${dateFmt})\r\n`;
            text += `________________________________________________________\r\n\r\n`;

            // Add "- " prefix to each line
            const lines = entry.content.split("\n").filter(l => l.trim());
            for (const line of lines) {
                const trimmed = line.trim();
                text += trimmed.startsWith("- ") ? trimmed + "\r\n" : `- ${trimmed}\r\n`;
            }
            text += "\r\n";
        }

        return text;
    },

    async _loadEntries() {
        const startDate = document.getElementById("export-date-start").value;
        const endDate = document.getElementById("export-date-end").value;

        if (!startDate || !endDate) {
            alert(I18n.t("selectDates"));
            return null;
        }

        if (startDate > endDate) {
            alert(I18n.t("invalidDateRange"));
            return null;
        }

        const entries = await DB.loadRange(startDate, endDate);

        if (entries.length === 0) {
            alert(I18n.t("noEntriesInRange"));
            return null;
        }

        return { entries, startDate, endDate };
    },

    async downloadTXT() {
        const data = await this._loadEntries();
        if (!data) return;

        const text = this.generateText(data.entries, data.startDate, data.endDate);
        const blob = new Blob([text], { type: "text/plain;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = this._buildFilename(data.startDate, data.endDate);
        a.click();
        URL.revokeObjectURL(url);
        this.closeModal();
    },

    async sendEmail() {
        const emailField = document.getElementById("export-email-field");
        const emailInput = document.getElementById("export-email");

        // First click: show email field
        if (emailField.classList.contains("hidden")) {
            emailField.classList.remove("hidden");
            emailInput.focus();
            return;
        }

        const email = emailInput.value.trim();
        if (!email) {
            alert(I18n.t("enterEmail"));
            emailInput.focus();
            return;
        }

        const data = await this._loadEntries();
        if (!data) return;

        const startFmt = `${this._formatDate(data.startDate)} (${this._getWeekdayShort(data.startDate)})`;
        const endFmt = `${this._formatDate(data.endDate)} (${this._getWeekdayShort(data.endDate)})`;
        const text = this.generateText(data.entries, data.startDate, data.endDate);

        const subject = encodeURIComponent(I18n.t("emailSubject").replace("{0}", startFmt).replace("{1}", endFmt));
        const body = encodeURIComponent(text);
        window.open(`mailto:${email}?subject=${subject}&body=${body}`, "_blank");
        this.closeModal();
    }
};

// ============================================================
// Router Module — hash-based routing
// ============================================================
const Router = {
    check() {
        if (window.location.hash === "#export") {
            window.location.hash = "";
            CSVExport.download();
        }
    },

    init() {
        window.addEventListener("hashchange", () => {
            if (Auth.currentUser) {
                this.check();
            }
        });
    }
};

// ============================================================
// Init — Wire up event listeners and start
// ============================================================
document.addEventListener("DOMContentLoaded", () => {
    // I18n — detect language and apply translations
    I18n.init();

    // Auth
    Auth.init();
    Router.init();

    // Login
    document.getElementById("btn-google-login").addEventListener("click", Auth.login);

    // Header actions
    document.getElementById("btn-logout").addEventListener("click", Auth.logout);
    document.getElementById("btn-export").addEventListener("click", () => TXTExport.openModal());

    // Calendar navigation
    document.getElementById("btn-prev-month").addEventListener("click", () => Calendar.prev());
    document.getElementById("btn-next-month").addEventListener("click", () => Calendar.next());

    // Modal
    document.getElementById("btn-close-modal").addEventListener("click", () => EntryForm.close());
    document.getElementById("btn-cancel-entry").addEventListener("click", () => EntryForm.close());
    document.getElementById("btn-save-entry").addEventListener("click", () => EntryForm.save());
    document.getElementById("btn-delete-entry").addEventListener("click", () => EntryForm.remove());

    // Export modal
    document.getElementById("btn-close-export").addEventListener("click", () => TXTExport.closeModal());
    document.getElementById("btn-export-txt").addEventListener("click", () => TXTExport.downloadTXT());
    document.getElementById("btn-export-email").addEventListener("click", () => TXTExport.sendEmail());

    // Email help (PC only — show button if not mobile/tablet)
    const isPC = !/Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (isPC) {
        document.getElementById("btn-email-help").classList.remove("hidden");
    }
    document.getElementById("btn-email-help").addEventListener("click", () => {
        document.getElementById("email-help-modal").classList.remove("hidden");
    });
    document.getElementById("btn-close-email-help").addEventListener("click", () => {
        document.getElementById("email-help-modal").classList.add("hidden");
    });
    document.getElementById("btn-email-help-ok").addEventListener("click", () => {
        document.getElementById("email-help-modal").classList.add("hidden");
    });

    // Close modals on overlay click
    document.getElementById("entry-modal").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) {
            EntryForm.close();
        }
    });
    document.getElementById("export-modal").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) {
            TXTExport.closeModal();
        }
    });
    document.getElementById("email-help-modal").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) {
            e.currentTarget.classList.add("hidden");
        }
    });

    // Close modals on Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            EntryForm.close();
            TXTExport.closeModal();
            document.getElementById("email-help-modal").classList.add("hidden");
        }
    });
});
