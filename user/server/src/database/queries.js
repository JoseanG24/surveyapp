//queries

export const queriesActivities = {
    displayUsersActivities: 'SELECT Name, Description, Tip, Code FROM Procesos WHERE Role = @Role',
    displaAllActivities: 'SELECT Name FROM Procesos'
}

export const queriesTimes = {
    saveTime: "INSERT INTO Tiempos (Survey, UserCode, Process, Timestamp) VALUES (@Survey, @UserCode, @Process, @Timestamp);",
}

export const queriesUsers = {
    validateUser: 'SELECT * FROM Usuarios WHERE username = @username AND password = @password',
    showUsers: 'SELECT Username, Password, Type, Role FROM Usuarios',
    displayUserInfo: 'SELECT Name, Code, Role, Ceco, Type FROM Usuarios',
    getUserCode: "SELECT Code FROM Usuarios WHERE Role = @Role"
}

export const queriesResourceGroups = {
    selectResourceGroup: 'SELECT Role FROM Usuarios WHERE Username = @Username AND Password = @Password'
}

export const queriesSurveys = {
    getSurveyCode: "SELECT Code FROM Encuestas WHERE Active = 1",
    checkActiveSurvey: "SELECT Active FROM Encuestas"
}