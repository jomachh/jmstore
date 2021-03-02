import { Switch, Route } from "react-router-dom";
import { Home, Checkout } from "../pages";

const Routes = () => (
  <Switch>
    <Route path="/" exact>
      <Home />
    </Route>
    <Route path="/checkout" exact>
      <Checkout />
    </Route>
  </Switch>
);

export default Routes;
