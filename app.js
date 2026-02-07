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
            alert("Erro ao fazer login. Tente novamente.");
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

        const monthNames = [
            "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
            "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
        ];
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

        // Format date for display: DD/MM/YYYY
        const [y, m, d] = dateStr.split("-");
        dateDisplay.textContent = `${d}/${m}/${y}`;

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
            alert("Nenhuma entrada para exportar.");
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
    // Auth
    Auth.init();
    Router.init();

    // Login
    document.getElementById("btn-google-login").addEventListener("click", Auth.login);

    // Header actions
    document.getElementById("btn-logout").addEventListener("click", Auth.logout);
    document.getElementById("btn-export").addEventListener("click", () => CSVExport.download());

    // Calendar navigation
    document.getElementById("btn-prev-month").addEventListener("click", () => Calendar.prev());
    document.getElementById("btn-next-month").addEventListener("click", () => Calendar.next());

    // Modal
    document.getElementById("btn-close-modal").addEventListener("click", () => EntryForm.close());
    document.getElementById("btn-save-entry").addEventListener("click", () => EntryForm.save());
    document.getElementById("btn-delete-entry").addEventListener("click", () => EntryForm.remove());

    // Close modal on overlay click
    document.getElementById("entry-modal").addEventListener("click", (e) => {
        if (e.target === e.currentTarget) {
            EntryForm.close();
        }
    });

    // Close modal on Escape
    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape") {
            EntryForm.close();
        }
    });
});
