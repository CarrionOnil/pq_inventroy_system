# custom_inv_mgmt

A full-stack inventory management platform designed to track, manage, and organize physical components and parts used in production workflows. Built for internal use at PQ Controls.

**Inventory Stock Management** – Add, edit, view, and delete parts and assemblies with metadata like quantity, location, barcode, and images.

**Search & Filters** – Quickly find parts using name, ID, barcode, and advanced filters like category, location, and status.

**Part Details Modal** – View detailed part information in a sleek modal, including image, attachments, and production metadata.

 **Add/Edit Forms** – Upload part images and attach files like spec sheets (PDFs) through intuitive forms.

**Attachments & Notes** – Store relevant documents, notes, and supplier information for each item.

 **Stock Logs** – Track inventory changes like additions and removals (planned).

**Scan & Barcode Support** – Scan barcodes to find items fast (planned). Right now only works on computer camera, but planning on implementing it with actual scanners once a database is setup and it is hosted on a local server.

 **Assembly Tracking** – Manage buildable assemblies composed of other parts (planned).

 ## Technologies

- **Frontend:** React, TailwindCSS, Vite, Headless UI, Lucide Icons
- **Backend:** FastAPI (Python)
- **Database:** N/A
- **File Uploads:** Static media hosting via FastAPI
- **API:** RESTful CRUD endpoints

How to use or start:

Install Frontend Dependencies(if needed):
cd frontend
npm install

Install Backend Dependencies:
cd ../backend
pip install -r requirements.txt

start the Backend Server:
source venv/Scripts/activate

uvicorn app.main:app --reload --port 8000

Start the Frontend:
cd ../frontend
npm run dev


Personal note:

I have two repos a personal one (for my portfolio) and a company one. When pushing to personal main follow up with:

git fetch personal
git checkout main
git reset --hard personal/main
git push company main --force