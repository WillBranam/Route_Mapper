import { createStackNavigator } from "react-navigation-stack";
import { createAppContainer } from "react-navigation";
import home from '../screens/home'
import  map  from "../screens/map";

 const screens = {
     home: {
         screen: home
     },
     map: {
         screen: map
     }
}

const HomeStack = createStackNavigator(screens)

export default createAppContainer(HomeStack);