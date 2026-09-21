export interface Agente { id:string; nome:string; especialidade:string; cidade:string; latitude:number; longitude:number; bio:string; telefone:string; foto?:string; }
export interface Projeto { id:string; titulo:string; descricao:string; categoria:string; orcamento:string; localizacao:string; }
export const MOCK_AGENTES:Agente[]=[
{id:'1',nome:'Ana Clara (Fotógrafa)',especialidade:'Fotografia',cidade:'Santos - SP',latitude:-23.9608,longitude:-46.3339,bio:'Fotógrafa especialista em retratos e eventos sociais.',telefone:'(13) 99999-1111'},
{id:'2',nome:'Carlos DJ',especialidade:'Música',cidade:'Santos - SP',latitude:-23.968,longitude:-46.328,bio:'DJ residente em eventos corporativos e casamentos.',telefone:'(13) 99999-2222'},
{id:'3',nome:'Lucas Videomaker',especialidade:'Videomaker',cidade:'Mongaguá - SP',latitude:-24.0538,longitude:-46.6212,bio:'Produção e edição de vídeos publicitários e clipes.',telefone:'(13) 99999-3333'}];
export const MOCK_PROJETOS:Projeto[]=[
{id:'1',titulo:'Cobertura Fotográfica de Aniversário',categoria:'Fotografia',orcamento:'R$ 800,00',localizacao:'Santos - SP',descricao:'Preciso de um fotógrafo para evento de 4 horas no Gonzaga.'},
{id:'2',titulo:'DJ para Festa Corporativa',categoria:'Música',orcamento:'R$ 1.200,00',localizacao:'Praia Grande - SP',descricao:'Procuramos DJ com equipamento próprio para evento de fim de ano.'}];
export const MOCK_USUARIO_LOGADO={
id:'user-001',documento:'12.345.678/0001-90',nome:'Joaquim Silva',nomeSocial:'',pronomes:'',email:'usuario@teste.com',tipo:'AGENTE',especialidade:'Design & Arte',cidade:'Santos - SP',latitude:-23.9608,longitude:-46.3339,bio:'Criativo independente focado em identidades visuais e ilustrações.',
empresa:'',telefone:'',descricao:'',site:'',endereco:'',categoria:''
};
