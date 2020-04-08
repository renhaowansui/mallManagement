import Vue from 'vue'
import { 
  Button,
  Form,
  FormItem,
  Input,
  Message,
  Container,
  Header,
  Aside,
  Main,
  Menu,
  MenuItem,
  MenuItemGroup,
  Submenu,
  RadioGroup,
  RadioButton,
  Breadcrumb,
  BreadcrumbItem,
  Table,
  TableColumn,
  Pagination,
  MessageBox,
  Dialog,
  Switch,
  Card,
  Row,
  Tag,
  Col,
  Tree,
  Select,
  Option,

 } from 'element-ui'

Vue.use(Button)
Vue.use(Form)
Vue.use(FormItem)
Vue.use(Input)
Vue.use(Container)
Vue.use(Header)
Vue.use(Aside)
Vue.use(Main)
Vue.use(Menu)
Vue.use(MenuItem)
Vue.use(MenuItemGroup)
Vue.use(Submenu)
Vue.use(RadioGroup)
Vue.use(RadioButton)
Vue.use(Breadcrumb)
Vue.use(BreadcrumbItem)
Vue.use(Table)
Vue.use(TableColumn)
Vue.use(Pagination)
Vue.use(Dialog)
Vue.use(Switch)
Vue.use(Card)
Vue.use(Row)
Vue.use(Tag)
Vue.use(Col)
Vue.use(Tree)
Vue.use(Select)
Vue.use(Option)

Vue.prototype.$message = Message
Vue.prototype.$prompt = MessageBox
Vue.prototype.$confirm = MessageBox.confirm