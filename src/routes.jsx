import { Routes, Route } from "react-router-dom"
import { Main } from "./pages/main";
import { Myprofile } from "./pages/myprofile";
import { Myadv } from "./pages/myadv";
import { Advpage } from "./pages/advpage";
import { Seller } from "./pages/sellerprofilepage";
import { useSelector } from "react-redux";
import { NotFound } from "./pages/404";

export const AppRoutes = () => {
    const isTokenGlobal = useSelector(state => state.product.tokenExists);
    return (
        <Routes>
            <Route path="/" element={<Main />}/>
            <Route path="/product/:id" element={<Advpage />}/>
            <Route path="/product/:id/seller/:sellerId" element={<Seller />}/>
            <Route path="/profile" element={<Myprofile isAuthenticated={isTokenGlobal} />} />
            <Route path="/profile/:id" element={<Myadv isAuthenticated={isTokenGlobal} />} />
            <Route path="*" element={<NotFound />} />
            <Route path="/404" element={<NotFound />} />
        </Routes>
    )
}