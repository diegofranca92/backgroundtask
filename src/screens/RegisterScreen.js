//AsyncStorage para armazenar no banco local do dispositivo;
//KeyboardAvoidingView para não ocultar elementos no iOS ao abrir o teclado;
//TouchableOpacity para alterar a opacidade de um botão ao clicar;
import React, { useState, useEffect } from 'react';
import { View,  KeyboardAvoidingView, ScrollView, Platform, Image, Text, TextInput, TouchableOpacity, TouchableHighlight, StyleSheet, Alert, Modal, SafeAreaView, Picker } from 'react-native';
import { showMessage, hideMessage } from "react-native-flash-message";
import { TextInputMask } from 'react-native-masked-text'
/* import * as ImagePicker from 'expo-image-picker'; */
import ImagePicker from 'react-native-image-picker';
import AsyncStorage from '@react-native-community/async-storage'
import Api from '../services/api';
import logo from '../../assets/images/logo.jpg';
import Colors from '../constants/Colors';
import Layout from '../constants/Layout';

export default function Register({ navigation }) {
  const [name, setName] = useState('');
  //const [nameUser, setNameUser] = useState('');
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [passConfirm, setPassConfirm] = useState('');
  const [cpf, setCpf] = useState('');
  const [celular, setCelular] = useState('');
  const [dataNascimento, setDataNascimento] = useState('');
  const [estados, setEstados] = useState([]);
  const [estado, setEstado] = useState('-');
  const [cidades, setCidades] = useState([]);
  const [cidade, setCidade] = useState('');
  const [fotoCnh, setFotoCnh] = useState({ "uri": ""});
  const [fotoComprovante, setFotoComprovante] = useState({ "uri": ""});
  const [fotoRosto, setFotoRosto] = useState({ "uri": ""});

  const [modalVisible, setModalVisible] = useState(false);

  //Ao abrir a tela
  useEffect(() => {
    getEstados();
  }, []);
  
  function validateEmail(mail) {
    if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)){
      return (true)
    } else{
      return (false)
    }
  }
  async function getEstados(){
    try {
      const response = await Api.api.get('/entregador/estados', {
        auth: { 
          username: Api.Auth_User, 
          password: Api.Auth_Pass 
        }
      });
      if(response.status === 200){
        response.data.unshift({"cd_estado": "", "nm_estado": "-"});
        setEstados(response.data);
      }
    } catch (error) {
      console.log(error);
    }
  }
  async function onchangeEstado(valor){
    setEstado(valor);
    try {
      const response = await Api.api.get('/entregador/cidades', {
        auth: { 
           username: Api.Auth_User, 
           password: Api.Auth_Pass 
        }
      });
      var arrCidades = await response.data.filter(function(item){
        return item.cd_estado === valor;         
      })
      if(response.status === 200){
        arrCidades.unshift({"cd_cidade": "", "nm_cidade": "-"});
        setCidades(arrCidades);
      }
    } catch (error) {
      console.log(error);
    }
  }

  // UPLOAD CNH
  async function uploadCNH() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        //aspect: [4, 3],
        quality: 0.6,
      });
      if (!result.cancelled) {
        result.type = result.type + "/" + result.uri.split(".").reverse()[0];
        result.name = result.uri.split("/").reverse()[0];
        setFotoCnh(result);
      }
      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };
  // UPLOAD COMPROVANTE DE RESIDÊNCIA
  async function uploadComprovante() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        //aspect: [16, 9],
        quality: 0.6,
      });
      if (!result.cancelled) {
        result.type = result.type + "/" + result.uri.split(".").reverse()[0];
        result.name = result.uri.split("/").reverse()[0];
        setFotoComprovante(result);
      }
      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };
  // UPLOAD IMAGEM PERFIL
  async function uploadFotoPerfil() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 0.6,
      });
      if (!result.cancelled) {
        result.type = result.type + "/" + result.uri.split(".").reverse()[0];
        result.name = result.uri.split("/").reverse()[0];
        setFotoRosto(result);
      }
      console.log(result);
    } catch (E) {
      console.log(E);
    }
  };

  async function handleSubmit() {
    if(name && email && cpf && celular && dataNascimento && cidade && pass && passConfirm){
      if(validateEmail(email)){
        if(pass === passConfirm){
          var formData = new FormData();
          formData.append('nm_entregador', name);
          formData.append('ds_email', email);
          formData.append('nr_cpf', cpf.split(".").join("").replace("-", ""));
          formData.append('nr_celular', celular.replace("(", "").replace(")", "").replace(" ", "").replace("-", ""));
          formData.append('dt_nascimento', dataNascimento.split("/").reverse().join("-"));
          formData.append('cd_cidade', cidade);
          formData.append('tp_opcao_princ_entrega', 'M');
          formData.append('tp_compartimento_entrega', 'B');
          formData.append('ds_senha', pass);
          //formData.append('ds_dir_ft_rosto', null); 
          //formData.append('ds_dir_ft_cnh', null); 
          //formData.append('ds_dir_ft_comp_res', null);
          if(fotoRosto.hasOwnProperty("type")){
            formData.append('ds_dir_ft_rosto', fotoRosto); 
          }
          if(fotoCnh.hasOwnProperty("type")){
            formData.append('ds_dir_ft_cnh', fotoCnh); 
          }
          if(fotoComprovante.hasOwnProperty("type")){
            formData.append('ds_dir_ft_comp_res', fotoComprovante); 
          } 
          Api.api({
            method: 'post',
            url: Api.baseURL + '/entregador/entregador',
            data: formData,
            headers: {'Content-Type': 'multipart/form-data'},
            auth: { 
              username: Api.Auth_User, 
              password: Api.Auth_Pass 
            },
            onUploadProgress: function (progressEvent) {
              console.log(progressEvent);
            },
          })
          .then(function(response) {
            console.log(response.data);
            if(response.status === 200){
              showMessage({
                message: "Seu cadastro foi realizado com sucesso!",
                backgroundColor: Colors.tintColor,
                color: "#000",
              });
              if(response.data !== null && response.data.hasOwnProperty("cd_entregador")){
                AsyncStorage.setItem("cd_entregador", response.data.cd_entregador);
                //Redireciona o usuário;
                navigation.navigate('Main');
              } else {
                //Redireciona o usuário;
                navigation.navigate('Login');
              }
            } else {
              showMessage({
                message: 'Falha ao realizar o cadastro! Tente novamente em breve!',
                type: "danger",
                color: "#fff",
              });
            }
          })
          .catch(function(response) {
            console.log(error);
            showMessage({
              message: 'Falha ao realizar o cadastro!',
              type: "danger",
              color: "#fff",
            });
          });
        } else{
          showMessage({
            message: 'As senhas não conferem!',
            type: "danger",
            color: "#fff",
          });
        }
      } else{
        showMessage({
          message: 'Por favor, informe um e-mail válido!',
          type: "danger",
          color: "#fff",
        });
      }
    } else{
      showMessage({
        message: 'Preencha todos os campos!',
        type: "danger",
        color: "#fff",
      });
    }
  }
  //console.log(cidades)
  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.container}>
        <Image source={logo} style={styles.logo}/>
        <Text style={styles.title}>Cadastre-se</Text>
        <View style={styles.form}>
          <Text style={styles.label}>NOME COMPLETO *</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu nome completo"
            placeholderTextColor="#666"
            autoCorrect={false}
            value={name}
            onChangeText={setName}
          />
          <Text style={styles.label}>CPF *</Text>
          <TextInputMask
            type={'cpf'}
            style={styles.input}
            placeholder="Seu CPF"
            placeholderTextColor="#666"
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
            value={cpf}
            onChangeText={text => {setCpf(text)}}
          />
          <Text style={styles.label}>E-MAIL *</Text>
          <TextInput
            style={styles.input}
            placeholder="Seu e-mail"
            placeholderTextColor="#666"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            value={email}
            onChangeText={setEmail}
          />
          <Text style={styles.label}>CELULAR *</Text>
          <TextInputMask
            type={'cel-phone'}
            options={{
              maskType: 'BRL',
              withDDD: true,
              dddMask: '(99) '
            }}
            style={styles.input}
            placeholder="Seu Celular"
            placeholderTextColor="#666"
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
            value={celular}
            onChangeText={text => {setCelular(text)}}
          />
          <Text style={styles.label}>DATA NASCIMENTO *</Text>
          <TextInputMask
            type={'datetime'}
            options={{
              format: 'DD/MM/YYYY'
            }}
            style={styles.input}
            placeholder="Sua data de nascimento"
            placeholderTextColor="#666"
            keyboardType="numeric"
            autoCapitalize="none"
            autoCorrect={false}
            value={dataNascimento}
            onChangeText={text => {setDataNascimento(text)}}
          />
          <Text style={styles.label}>ESTADO *</Text>
          <Picker
            selectedValue={estado}
            mode="dropdown"
            placeholder="Selecione o estado"
            iosHeader="Selecione o estado"
            itemStyle={styles.picker}
            style={styles.picker}
            onValueChange={(itemValue) => onchangeEstado(itemValue)}>
            {estados.map((estadosMap, index) => {
              return(
                <Picker.Item key={index} color='#000' label={estadosMap.nm_estado} value={estadosMap.cd_estado}/>
              );
            })}
          </Picker>
          <Text style={styles.label}>CIDADE *</Text>
          <Picker
            selectedValue={cidade}
            mode="dropdown"
            placeholder="Selecione a cidade"
            iosHeader="Selecione a cidade"
            itemStyle={styles.picker}
            style={styles.picker}
            onValueChange={(itemValue) => setCidade(itemValue)}>
            {cidades.map((item, index) => {
              return(
                <Picker.Item key={index} color='#000' label={item.nm_cidade} value={item.cd_cidade}/>
              );
            })}
          </Picker>
          <Text style={styles.label}>FOTO DA CNH </Text>
          <Image source={{ uri: fotoCnh.uri ? fotoCnh.uri : 'https://www.ifs.edu.br/images/M_images/default.png'}} style={fotoCnh.uri !== "" ? styles.uploadImage : styles.hidden} />
          <TouchableOpacity onPress={uploadCNH} style={styles.buttonUpload}>
            <Text style={styles.buttonTextUpload}> {fotoCnh.uri === "" ? 'Adicionar Foto da CNH' : 'Alterar Foto da CNH'}</Text>
          </TouchableOpacity>
          <Text style={styles.label}>FOTO COMPROVANTE DE RESIDÊNCIA </Text>
          <Image source={{ uri: fotoComprovante.uri ? fotoComprovante.uri : 'https://www.ifs.edu.br/images/M_images/default.png'}} style={fotoComprovante.uri !== "" ? styles.uploadImage : styles.hidden} />
          <TouchableOpacity onPress={uploadComprovante} style={styles.buttonUpload}>
            <Text style={styles.buttonTextUpload}> {fotoComprovante.uri === "" ? 'Adicionar Comprovante de Residência' : 'Alterar Comprovante de Residência'}</Text>
          </TouchableOpacity>
          <Text style={styles.label}>FOTO DE PERFIL </Text>
          <Image source={{ uri: fotoRosto.uri ? fotoRosto.uri : 'https://www.ifs.edu.br/images/M_images/default.png'}} style={fotoRosto.uri !== "" ? styles.uploadImage : styles.hidden} />
          <TouchableOpacity onPress={uploadFotoPerfil} style={styles.buttonUpload}>
            <Text style={styles.buttonTextUpload}> {fotoRosto.uri === "" ? 'Adicionar Foto de Perfil' : 'Alterar Foto de Perfil'}</Text>
          </TouchableOpacity>
          <Text style={styles.label}>SENHA *</Text>
          <TextInput
            style={styles.input}
            placeholder="Sua Senha"
            placeholderTextColor="#666"
            autoCapitalize="none"
            secureTextEntry={true}
            autoCorrect={false}
            value={pass}
            onChangeText={setPass}
          />
          <Text style={styles.label}>CONFIRMAR SENHA *</Text>
          <TextInput
            style={styles.input}
            placeholder="Confirme sua Senha"
            placeholderTextColor="#666"
            autoCapitalize="none"
            secureTextEntry={true}
            autoCorrect={false}
            value={passConfirm}
            onChangeText={setPassConfirm}
          />
          <TouchableOpacity onPress={handleSubmit} style={styles.button}>
            <Text style={styles.buttonText}> Criar Conta </Text>
          </TouchableOpacity>
        </View>
        <View style={styles.register}>
          <Text style={styles.labelRegister}>Já possui uma conta? </Text> 
          <TouchableOpacity onPress={() => navigation.navigate("Login")}>
            <Text style={styles.btnRegister}>Fazer Login</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
}

// Cria os Styles. Os styles não são herdados da classe pai e são em formato de json.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: 'center',
    alignItems: 'center'
  },

  logo: {
    width: 160,
    height: 100,
    resizeMode: "contain",
    marginVertical: 15
  },

  title: {
    fontWeight: 'bold',
    color: "#fff",
    //marginTop: 10,
    fontSize: 22,
  },

  form: {
    alignSelf: 'stretch',
    paddingHorizontal: 15,
    marginTop: 50,
    width: Layout.window.width,
    maxWidth: 550,
  },

  label: {
    fontWeight: 'bold',
    color: "#fff",
    marginBottom: 8,
  },

  input: {
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 10,
    fontSize: 16,
    color: "#fff",
    height: 44,
    marginBottom: 20,
    borderRadius: 3
  },

  picker: { 
    height: 40, 
    width: '100%', 
    backgroundColor: "#fff",
    marginBottom: 15,
  },

  button: {
    height: 42,
    backgroundColor: Colors.tintColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 25,
    marginHorizontal:15,
  },

  buttonText: {
    color: "#000",
    fontWeight: 'bold',
    fontSize: 16,
  },
  divider:{
    marginTop: 40,
    marginBottom: 10,
    marginHorizontal: 0,
    borderBottomWidth: 1,
    borderBottomColor: '#CFCFCF',
  },
  register:{
    marginTop: 50,
    flexDirection: 'row',
  },
  btnRegister: {
    fontWeight: 'bold',
    color: "#fff",
    textDecorationLine: "underline",
    paddingBottom: 15,
  },
  labelRegister: {
    color: "#fff",
  },
  
  // MODAL
  modal: {
    //margin: 15
  },
  bodyModal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.backgroundDefault,
    paddingHorizontal: 15,
    //paddingTop: 30,
  },
  btnCloseModal: {
    textAlign: "right",
    paddingTop: 7,
    paddingRight: 7,
    backgroundColor: Colors.backgroundDefault,
  },
  iconPremium: {
    width: 120,
    height: 120,
    resizeMode: "contain",
    marginTop: -40,
    marginBottom: 20
  },
  titleModal: {
    fontWeight: 'bold',
    color: "#fff",
    marginTop: 15,
    fontSize: 20,
    paddingHorizontal: 20,
    textAlign: "center"
  },
  subTitleModal: {
    color: "#fff",
    textAlign: "center",
    marginTop: 50,
    fontSize: 16,
  },
  btnModal: {
    height: 42,
    backgroundColor: Colors.tintColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 55,
    marginHorizontal:15,
  },
  buttonTextModal: {
    color: "#fff",
    fontWeight: 'bold',
    fontSize: 16,
    paddingHorizontal: 20,
  },
  buttonUpload: {
    height: 30,
    backgroundColor: Colors.tintColor,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
    marginTop: 10,
    //marginHorizontal:15,
    marginBottom:20,
    paddingHorizontal:5,
  },
  buttonTextUpload: {
    color: Colors.backgroundDefault,
    fontWeight: 'bold',
    fontSize: 12,
  },
  uploadImage: {
    width: Layout.window.width*0.9,
    maxWidth: 400,
    paddingHorizontal: 20,
    height: 180,
    resizeMode: 'cover',
    borderRadius: 5,
    //borderColor: 'gray',
    //borderWidth: 2,
  },
});