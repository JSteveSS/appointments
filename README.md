# Appointment Service API

API backend para gestionar agendamientos médicos de asegurados.  
Permite registrar y consultar agendamientos mediante endpoints HTTP, implementada con **Serverless Framework** sobre AWS Lambda y API Gateway.

---

## Endpoints

| Método | URL |
|--------|-----|
| POST   | `https://2vu40s1va9.execute-api.us-east-1.amazonaws.com/appointments` |
| GET    | `https://2vu40s1va9.execute-api.us-east-1.amazonaws.com/appointments/{insuredId}` |

### POST /appointments
Registra un nuevo agendamiento.  
**Body ejemplo:**
```json
{
  "insuredId": "00456",
  "scheduleId": 200,
  "countryISO": "PE"
}
```
Use el archivo https://github.com/JSteveSS/appointments/blob/master/FLUJO.postman_collection.json para realizar pruebas.
