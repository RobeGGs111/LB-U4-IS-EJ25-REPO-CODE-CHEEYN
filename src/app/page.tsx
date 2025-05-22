import Menu from './components/Menu';
import CategoriasMenu from './components/CategoriasMenu';
import Productos from './components/Products';
//import Carrito from './carrito/page';

export default function Home() {
  return (
    <div>
      <Menu />
      <CategoriasMenu />
      <Productos/>
      {/* <Carrito/> */}
    </div>
  );
}
