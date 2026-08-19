"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserProvider = UserProvider;
exports.useUsuario = useUsuario;
var react_1 = require("react");
// ─── Dados iniciais (mock — futuramente vem da API) ──────────────────────────
var dadosIniciais = {
    nome: '',
    especialidade: '',
    bio: '',
    cidade: '',
    avatarUrl: '',
    latitude: -23.555,
    longitude: -46.67,
    visivelNoMapa: false,
};
var UserContext = (0, react_1.createContext)({});
function UserProvider(_a) {
    var children = _a.children;
    var _b = (0, react_1.useState)(dadosIniciais), usuario = _b[0], setUsuario = _b[1];
    function atualizarUsuario(dados) {
        setUsuario(function (prev) { return (__assign(__assign({}, prev), dados)); });
    }
    return (<UserContext.Provider value={{ usuario: usuario, atualizarUsuario: atualizarUsuario }}>
      {children}
    </UserContext.Provider>);
}
function useUsuario() {
    return (0, react_1.useContext)(UserContext);
}
