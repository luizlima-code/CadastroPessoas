import React, { Component } from "react";
import axios from "axios";
import Main from "../template/Main";

const headerProps = {
  icon: "users",
  title: "Usuários",
  subtitle: "Pagina de Usuários: Criar, Editar e Excluir",
};

const baseUrl = "http://localhost:3001/users";
const initialState = {
  user: { name: "", email: "", date: "", city: "", state: "" },
  list: [],
};

export default class UserCrud extends Component {
  state = { ...initialState };

  componentWillMount() {
    axios(baseUrl).then((resp) => {
      this.setState({ list: resp.data });
    });
  }

  clear() {
    this.setState({ user: initialState.user });
  }

  isEmail() {
    const email = this.state.user.email;
    if (typeof email !== "undefined") {
      const pattern = new RegExp(
        /^(("[\w-\s]+")|([\w-]+(?:\.[\w-]+)*)|("[\w-\s]+")([\w-]+(?:\.[\w-]+)*))(@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$)|(@\[?((25[0-5]\.|2[0-4][0-9]\.|1[0-9]{2}\.|[0-9]{1,2}\.))((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\.){2}(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[0-9]{1,2})\]?$)/i
      );

      if (!pattern.test(email)) {
        return false;
      }
    }
  }

  save(e) {
    e.preventDefault();
    const name = this.state.user.name.length;
    const email = this.state.user.email;
    const city = this.state.user.city.length;
    const state = this.state.user.state.length;
    const emailValid = this.isEmail(email);
    if (name === 0) {
      return alert("Campo nome obrigatório");
    } else if (email.length === 0) {
      return alert("Campo email obrigatório");
    } else if (emailValid === false) {
      return alert("Endereço de email inválido");
    } else if (city === 0) {
      return alert("Campo cidade obrigatório");
    } else if (state !== 2) {
      return alert("Campo estado obrigatório");
    } else {
      this.setState(() => {
        return this.saveEnd();
      });
    }
  }

  saveEnd() {
    const user = this.state.user;
    const method = user.id ? "put" : "post";
    const url = user.id ? `${baseUrl}/${user.id}` : baseUrl;
    axios[method](url, user).then((resp) => {
      const list = this.getUpdatedList(resp.data);
      this.setState({ user: initialState.user, list });
    });
  }

  getUpdatedList(user, add = true) {
    const list = this.state.list.filter((u) => u.id !== user.id);
    if (add) list.unshift(user);
    return list;
  }

  updateField(event) {
    const user = { ...this.state.user };
    user[event.target.name] = event.target.value;
    this.setState({ user });
  }

  renderForm() {
    return (
      <form className="form">
        <div className="row">
          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>Nome</label>
              <input
                type="text"
                className="form-control"
                name="name"
                value={this.state.user.name}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o nome..."
              />
            </div>
          </div>

          <div className="col-12 col-md-6">
            <div className="form-group">
              <label>E-mail</label>
              <input
                type="text"
                className="form-control"
                name="email"
                value={this.state.user.email}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o e-mail..."
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="form-group">
              <label>Data de Nascimento</label>
              <input
                type="date"
                className="form-control"
                name="date"
                value={this.state.user.date}
                onChange={(e) => this.updateField(e)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <div className="form-group">
              <label>Cidade</label>
              <input
                type="text"
                className="form-control"
                name="city"
                value={this.state.user.city}
                onChange={(e) => this.updateField(e)}
                placeholder="Digite o nome da cidade..."
              />
            </div>
          </div>

          <div className="col-12 col-md-2">
            <div className="form-group">
              <label>Estado</label>
              <input
                type="text"
                className="form-control"
                maxlength="2"
                name="state"
                value={this.state.user.state}
                onChange={(e) => this.updateField(e)}
                placeholder="Ex: MG"
              />
            </div>
          </div>
        </div>

        <hr />
        <div className="row d-flex pb-2">
          <div className="col-12 d-flex justify-content-end">
            <button className="btn btn-primary" onClick={(e) => this.save(e)}>
              Salvar
            </button>

            <button
              className="btn btn-secondary ml-2"
              onClick={(e) => this.clear(e)}
            >
              Cancelar
            </button>
          </div>
        </div>
      </form>
    );
  }

  load(user) {
    this.setState({ user });
  }

  remove(user) {
    axios.delete(`${baseUrl}/${user.id}`).then((resp) => {
      const list = this.getUpdatedList(user, false);
      this.setState({ list });
    });
  }

  renderTable() {
    return (
      <table className="table mt-6">
        <thead>
          <tr>
            <th></th>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Date Nascimento</th>
            <th>Cidade / Estado</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>{this.renderRows()}</tbody>
      </table>
    );
  }

  renderRows() {
    return this.state.list.map((user) => {
      return (
        <tr key={user.id}>
          <td></td>
          <td>{user.name}</td>
          <td>{user.email}</td>
          <td>{user.date}</td>
          <td>
            {user.city}/{user.state}
          </td>
          <td>
            <button className="btn btn-warning" onClick={() => this.load(user)}>
              <i className="fa fa-pencil"></i>
            </button>
            <button
              className="btn btn-danger ml-2"
              onClick={() => this.remove(user)}
            >
              <i className="fa fa-trash"></i>
            </button>
          </td>
        </tr>
      );
    });
  }

  render() {
    return (
      <Main {...headerProps}>
        {this.renderForm()}
        {this.renderTable()}
      </Main>
    );
  }
}
