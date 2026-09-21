import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useState } from 'react';
import { ActivityIndicator, Alert, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useUser } from '@/providers/user-provider';
import { colors } from '@/shared/theme/colors';

export default function EditContractorProfileScreen() {
  const navigation=useNavigation<any>(); const {user,updateProfile}=useUser();
  const [nome,setNome]=useState(user.nome||''); const [empresa,setEmpresa]=useState(user.empresa||'');
  const [telefone,setTelefone]=useState(user.telefone||''); const [categoria,setCategoria]=useState(user.categoria||'');
  const [cidade,setCidade]=useState(user.cidade||''); const [endereco,setEndereco]=useState(user.endereco||'');
  const [site,setSite]=useState(user.site||''); const [descricao,setDescricao]=useState(user.descricao||''); const [salvando,setSalvando]=useState(false);
  const salvar=async()=>{if(!nome.trim()||!empresa.trim()){Alert.alert('Campos obrigatórios','Informe seu nome e sua empresa.');return;}setSalvando(true);try{const dados={nome:nome.trim(),empresa:empresa.trim(),telefone:telefone.trim(),categoria:categoria.trim(),cidade:cidade.trim(),endereco:endereco.trim(),site:site.trim(),descricao:descricao.trim()};updateProfile(dados);Alert.alert('Perfil atualizado','Suas informações foram salvas.');navigation.goBack();}catch(e){Alert.alert('Erro',e instanceof Error?e.message:'Não foi possível salvar o perfil.');}finally{setSalvando(false);}};
  return <SafeAreaView style={styles.container}><View style={styles.header}><TouchableOpacity onPress={()=>navigation.goBack()}><Ionicons name="chevron-back" size={25} color={colors.text}/></TouchableOpacity><Text style={styles.headerTitle}>Editar perfil do contratante</Text><View style={{width:25}}/></View>
  <ScrollView contentContainerStyle={styles.content}><Text style={styles.intro}>Complete os dados da empresa para transmitir mais confiança aos profissionais.</Text>
  <Field label="Nome do responsável" value={nome} onChangeText={setNome} placeholder="Seu nome completo"/><Field label="Empresa / organização" value={empresa} onChangeText={setEmpresa} placeholder="Nome da empresa"/>
  <Field label="Categoria" value={categoria} onChangeText={setCategoria} placeholder="Ex.: Eventos, cultura, publicidade"/><Field label="Telefone" value={telefone} onChangeText={setTelefone} placeholder="(13) 99999-9999" keyboardType="phone-pad"/>
  <Field label="Cidade" value={cidade} onChangeText={setCidade} placeholder="Ex.: Santos - SP"/><Field label="Endereço" value={endereco} onChangeText={setEndereco} placeholder="Rua, número, bairro"/>
  <Field label="Site / rede social" value={site} onChangeText={setSite} placeholder="https://..."/>
  <Text style={styles.label}>Sobre a empresa</Text><TextInput style={styles.multiline} value={descricao} onChangeText={setDescricao} placeholder="Conte sobre a empresa, tipos de eventos e serviços..." placeholderTextColor={colors.muted} multiline maxLength={500} textAlignVertical="top"/><Text style={styles.counter}>{descricao.length}/500</Text>
  <TouchableOpacity style={styles.button} onPress={salvar} disabled={salvando}>{salvando?<ActivityIndicator color={colors.white}/>:<><Text style={styles.buttonText}>Salvar alterações</Text><Ionicons name="checkmark" size={19} color={colors.white}/></>}</TouchableOpacity></ScrollView></SafeAreaView>;
}
function Field({label,...props}:{label:string}&React.ComponentProps<typeof TextInput>){return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput style={styles.input} placeholderTextColor={colors.muted} {...props}/></View>}
const styles=StyleSheet.create({container:{flex:1,backgroundColor:colors.background},header:{height:58,paddingHorizontal:18,flexDirection:'row',alignItems:'center',justifyContent:'space-between'},headerTitle:{fontSize:17,fontWeight:'900',color:colors.text},content:{padding:20,paddingBottom:45},intro:{fontSize:13,lineHeight:20,color:colors.muted,marginBottom:20},field:{marginBottom:15},label:{fontSize:13,fontWeight:'800',color:colors.text,marginBottom:7},input:{minHeight:49,borderWidth:1,borderColor:colors.border,borderRadius:10,backgroundColor:colors.white,paddingHorizontal:13,color:colors.text,fontSize:14},multiline:{minHeight:120,borderWidth:1,borderColor:colors.border,borderRadius:10,backgroundColor:colors.white,padding:13,color:colors.text,fontSize:14},counter:{fontSize:11,color:colors.muted,textAlign:'right',marginTop:4},button:{height:50,borderRadius:11,backgroundColor:colors.primaryDark,flexDirection:'row',alignItems:'center',justifyContent:'center',gap:7,marginTop:24},buttonText:{color:colors.white,fontWeight:'900',fontSize:15}});
