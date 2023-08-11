import React, { useState, useEffect } from "react";
import Header from "./header";
import styles from "../styles/users.module.css";

const Users = ({ onLogout }) => {
  const [users, setUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetch("http://localhost:5000/login")
      .then((response) => response.json())
      .then((data) => {
        setUsers(data);
      });
  }, []);

  const handleLogout = () => {
    onLogout();
  };

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const filteredUsers = users.filter(
    (user) =>
      user.Name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="">
      <div className={styles.mainHeader}>
        <Header />
        <button onClick={handleLogout} className={styles.logout}>
          Salir
        </button>
      </div>
      <div className={styles.userList}>
        <p className={styles.title}>📂Cátalogo Usuarios</p>
        <div className={styles.searchContainer}>
          <input
            type="text"
            placeholder="Buscar por nombre de usuario"
            value={searchTerm}
            onChange={handleSearch}
            className={styles.searchInput}
          />
        </div>
        <div className={styles.tableContainer}>
          {filteredUsers.length === 0 ? (
            <p className={styles.emptyMessage}>No se encontraron usuarios.</p>
          ) : (
            <table className={styles.userTable}>
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Username</th>
                  <th>Password</th>
                  <th>Ceco</th>
                  <th>Role</th>
                  <th>Type</th>
                </tr>
              </thead>
              <tbody>
                {filteredUsers.map((user) => (
                  <tr key={user.Code}>
                    <td>{user.Name}</td>
                    <td>{user.Username}</td>
                    <td>{user.Password}</td>
                    <td>{user.Ceco}</td>
                    <td>{user.Role}</td>
                    <td>{user.Type}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
