# How to Run InvoiceMate

This project consists of two parts:
1. **Backend** (.NET API) - runs on `http://localhost:5000`
2. **Frontend** (Next.js) - runs on `http://localhost:3000`

## Prerequisites

- **.NET SDK 9.0** or later (for backend)
- **Node.js 20+** and **npm** (for frontend)

## Running the Backend

1. Navigate to the backend API project:
   ```powershell
   cd src\backend\InvoiceMate.Api
   ```

2. Restore dependencies (first time only):
   ```powershell
   dotnet restore
   ```

3. Run the API:
   ```powershell
   dotnet run
   ```

   Or if you prefer to use Visual Studio or Rider, open the solution file:
   ```powershell
   cd src\backend
   dotnet sln InvoiceMate.sln
   ```

The API will be available at:
- HTTP: `http://localhost:5000`
- HTTPS: `https://localhost:5001`
- Swagger UI: `http://localhost:5000/swagger`

## Running the Frontend

1. Navigate to the frontend directory:
   ```powershell
   cd src\frontend
   ```

2. Install dependencies (first time only):
   ```powershell
   npm install
   ```

3. Run the development server:
   ```powershell
   npm run dev
   ```

The frontend will be available at: `http://localhost:3000`

## Accessing the Application

1. Open your browser and navigate to: `http://localhost:3000`
2. Click "Criar Invoice" or navigate to: `http://localhost:3000/invoice`
3. Fill out the invoice form and submit to generate a PDF

## Environment Variables (Optional)

If your backend API runs on a different port or URL, create a `.env.local` file in the `src/frontend` directory:

```
NEXT_PUBLIC_API_URL=http://localhost:5000
```

## Troubleshooting

### CORS Issues
If you see CORS errors in the browser console, make sure:
- The backend is running
- CORS is configured correctly in `Program.cs` (already set up for localhost:3000 and localhost:3001)

### API Connection Issues
- Verify the backend is running on port 5000
- Check the browser console for errors
- Verify the API endpoint: `http://localhost:5000/api/Invoice/generate-pdf`

### Port Already in Use
If port 3000 (frontend) or 5000 (backend) is already in use:
- For frontend: Change the port by running `npm run dev -- -p 3001`
- For backend: Edit `Properties/launchSettings.json` to change the port

## Building for Production

### Backend
```powershell
cd src\backend\InvoiceMate.Api
dotnet publish -c Release
```

### Frontend
```powershell
cd src\frontend
npm run build
npm start
```

