import { Route, Routes } from "react-router-dom";
import ProfileMain from "./profileMain/profileMain";
import PinCheck from "./profilePinCheck/profilePinCheck";
import EditProfile from "./profileEdit/profileEdit";
import PetProfile from "./pet/profilePet/prifolePet";
import PetRegister from "./pet/profilePetRegister/profilePetRegister";
import EditPassword from "./profileEditPassword/profileEditPassword";
import PetRegister2 from "./pet/profilePetRegister2/profilePetRegister2";
import PetProfileDetail from "./pet/profilePetDetail/profilePetDetail";

function Profile() {
  return (
    <>
      <Routes>
        <Route path="/" element={<ProfileMain></ProfileMain>}></Route>
        <Route path="/editProfile" element={<EditProfile></EditProfile>}></Route>
        <Route path="/editPassword" element={<EditPassword></EditPassword>}></Route>
        <Route path="/petProfile" element={<PetProfile></PetProfile>}></Route>
        <Route path="/petProfile/detail/:id" element={<PetProfileDetail></PetProfileDetail>}></Route>
        <Route path="/petRegister" element={<PetRegister></PetRegister>}></Route>
        <Route path="/petRegister2/:id" element={<PetRegister2></PetRegister2>}></Route>
        <Route path="/pincheck" element={<PinCheck></PinCheck>}></Route>
      </Routes>
    </>
  );
}

export default Profile;
