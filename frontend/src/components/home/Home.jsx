import React, { Component } from "react";
import Main from "../template/Main";
import axios from "axios";

const baseUrl = "http://localhost:3001/users";
const initialState = {
  user: { name: "", email: "", date: "", city: "", state: "" },
  list: [],
};

export default class Home extends Component {

    state = { ...initialState }

    componentWillMount() {
        axios(baseUrl).then(resp => {
            this.setState({ list: resp.data })
        })
    }


  render() {
      return this.state.list.map(user => {
        return (
            <Main icon="home" title="Início" subtitle="Lista atualizada de cadastros">
              <div className="display-2 d-flex justify-content-center">Bem Vindo!</div>
              <p className="display-4">
                Dados atualizados:
              </p>
              <hr />
              <div key={user.id}>
                <p>Numero de pessoas cadastradas: {this.state.list.length} </p>
                <hr/>
                <p>Cidades presentes em cadastro: {this.state.list.map(user => {
                    return (
                        <th className="col-12 d-flex justify-content-start">{user.city}/{user.state}</th>
                    );
                })}</p>
                <p>Menor idade entre as pessoas cadastradas é: {user.date.split("-").reverse().join("")}</p>
                <p>Maior idade entre as pessoas cadastradas é: {user.date.split("-").reverse().join("")} </p>
                <p>Média de idade das pessoas cadastradas é: {user.date.split("-").reverse().join("")} </p>
              </div>
            </Main>
          );
      })
  }
}
