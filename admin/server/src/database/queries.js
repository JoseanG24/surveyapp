/*
Restricciones de integridad
Usuarios:
 - FK__Usuarios__Ceco__21B6055D
 - FK__Usuarios__Role__20C1E124

Cecos
 - FK__Cecos__Parent__300424B4

Puestos
 - FK__Puestos__Parent__30F848ED 
*/

export const queriesUsers = {
  getUsers: 'SELECT * FROM Usuarios',
  validateUser: 'SELECT * FROM Usuarios WHERE Username = @Username AND Password = @Password'  
}
  
export const queriesCecos = {
  getCecos: 'SELECT Name, Code, Parent from Cecos',
  selectCecos: 'SELECT * FROM Usuarios WHERE Ceco = @Ceco'
}

export const queriesResourceGroups = {
  getResourceGroups: 'SELECT * FROM Puestos',
  selectPuestos: 'SELECT * FROM Usuarios WHERE Role = @Role'
}

export const queriesActivities = {
   displayAllActivities: "SELECT * FROM Procesos",
   displayProcesses: "SELECT Type FROM Procesos"
}

export const queriesSurveys = {
  creteNewSurvey: "INSERT INTO Encuestas (Code, Number, Description) VALUES (@Code, @Number, @Description)",
  activateSurvey: "UPDATE Encuestas SET Active = 1 WHERE Code = @Code",
  deactivateSurvey: "UPDATE Encuestas SET Active = 0 WHERE Code = @Code",
  showAllSurveys: "SELECT * FROM Encuestas",
  deleteSurveys: "DELETE FROM Surveys WHERE Code = @Code"
}

export const queriesTimes = {
  displayTimes: "SELECT * FROM Tiempos"
}

/*
ALTER TABLE Usuarios NOCHECK CONSTRAINT FK__Usuarios__Ceco__21B6055D; 
ALTER TABLE Cecos NOCHECK CONSTRAINT FK__Cecos__Parent__300424B4; 
DELETE FROM Cecos WHERE Parent IN (SELECT Code FROM Usuarios WHERE Code IN (1, 1000, 1001)); 
DELETE FROM Usuarios WHERE Code IN (1, 1000, 1001); 
ALTER TABLE Usuarios CHECK CONSTRAINT FK__Usuarios__Ceco__21B6055D; 
ALTER TABLE Cecos CHECK CONSTRAINT FK__Cecos__Parent__300424B4; 

INSERT INTO Usuarios (Code, Name, Username, Password, Role, Ceco) 
SELECT Code, Name, Username, Password, Role, Ceco FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0', 'Excel 12.0;Database=C:\Users\josea\OneDrive\Documentos\Users (1).xlsx;HDR=YES;IMEX=1', 'SELECT Code, Name, Username, Password, Role, Ceco FROM [Usuarios$]')


-- INSERTAR PUESTOS	(SIN Usuarios)
INSERT INTO Puestos (Code, Name) 
SELECT Code, Name FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0', 'Excel 12.0;Database=C:\Users\josea\OneDrive\Documentos\Users (1).xlsx;HDR=YES;IMEX=1', 'SELECT Code, Name FROM [Puestos$]')

-- INSERTAR CENTROS DE COSTO (SIN Usuarios)
INSERT INTO Cecos (Code, Name)
SELECT Code, Name FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0', 'Excel 12.0;Database=C:\Users\josea\OneDrive\Documentos\Users (1).xlsx;HDR=YES;IMEX=1', 'SELECT Code, Name FROM [Centros de Costo$]')


SELECT * FROM Usuarios
Select * From Puestos
Select * From Cecos


--INSERTAR USUARIOS

INSERT INTO Usuarios (Code, Name, Username, Password, Role, Ceco) 
SELECT Code, Name, Username, Password, Role, Ceco FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0', 'Excel 12.0;Database=C:\Users\josea\OneDrive\Documentos\Users (1).xlsx;HDR=YES;IMEX=1', 'SELECT Code, Name, Username, Password, Role, Ceco FROM [Usuarios$]')

INSERT INTO Puestos (Parent)
SELECT Parent FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0', 'Excel 12.0;Database=C:\Users\josea\OneDrive\Documentos\Users (1).xlsx;HDR=YES;IMEX=1', 'SELECT Parent FROM [Puestos$]')

INSERT INTO Cecos(Parent)
SELECT Parent FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0', 'Excel 12.0;Database=C:\Users\josea\OneDrive\Documentos\Users (1).xlsx;HDR=YES;IMEX=1', 'SELECT Parent FROM [Centros de Costo$]')


--	RE INSERTAR USUARIOS 

DELETE FROM Usuarios
DELETE FROM Puestos
DELETE FROM Cecos

INSERT INTO Puestos (Code, Name) 
SELECT Code, Name FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0', 'Excel 12.0;Database=C:\Users\josea\OneDrive\Documentos\Users (1).xlsx;HDR=YES;IMEX=1', 'SELECT Code, Name FROM [Puestos$]')
	
INSERT INTO Cecos (Code, Name)
SELECT Code, Name FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0', 'Excel 12.0;Database=C:\Users\josea\OneDrive\Documentos\Users (1).xlsx;HDR=YES;IMEX=1', 'SELECT Code, Name FROM [Centros de Costo$]')

INSERT INTO Usuarios (Code, Name, Username, Password, Role, Ceco) 
SELECT Code, Name, Username, Password, Role, Ceco FROM OPENROWSET('Microsoft.ACE.OLEDB.12.0', 'Excel 12.0;Database=C:\Users\josea\OneDrive\Documentos\Users (1).xlsx;HDR=YES;IMEX=1', 'SELECT Code, Name, Username, Password, Role, Ceco FROM [Usuarios$]')

*/