import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAlert } from "../../../../Component/alertText/alertText";
import Topbar from "../../../../Component/topbar/topbar";
import instanceJson from "../../../../Component/axios/axiosJson";
import instanceMultipart from "../../../../Component/axios/axiosMultipart";

function PetProfileDetail() {
  const navigate = useNavigate(); //페이지 이동
  const alertBox = useAlert();
  const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); //현재 연도
  //기본정보
  const { id } = useParams();
  const [name, setName] = useState<string>(""); //이름
  const [age, setAge] = useState<string>(""); //나이
  const [species, setSpecies] = useState<string>(""); //견종
  const [gender, setGender] = useState<string>(""); //성별
  const [petImageUrl, setPetImgaeUrl] = useState<string>(""); //이미지

  const [neutering, setNeutering] = useState<boolean>(false); //중성화여부

  const [petImage, setPetImage] = useState<File | null>(null); //이미지
  const [previewImage, setPreviewImage] = useState<string | null>(null); //미리보기 이미지

  const [pageState, setPageState] = useState<boolean>(true);

  //추가 정보
  const [weight, setWeight] = useState<string>(""); //몸무게
  const [animalHospital, setAnimalHospital] = useState<string>(""); //동물병원
  const [vaccination, setVaccination] = useState<string>("접종하지 않았습니다"); //예방접종
  const [etc, setEtc] = useState<string>(""); //기타
  const [checkListState, setCheckListState] = useState<boolean>(false); //체크리스트 상태
  const [checkList, setCheckList] = useState([
    { id: 1, name: "광견병", checked: false },
    { id: 2, name: "코로나", checked: false },
    { id: 3, name: "켄넬코프", checked: false },
    { id: 4, name: "종합백신", checked: false },
    { id: 5, name: "접종하지 않았습니다", checked: false },
  ]); //체크리스트

  //펫정보 가져오기api
  useEffect(() => {
    instanceJson
      .get(`/mypage/pet?pet_id=${id}`)
      .then((r: any) => {
        console.log(r.data.pet_info);
        setName(r.data.pet_info.petName);
        setAge((currentYear - r.data.pet_info.birthYear).toString());
        setSpecies(r.data.pet_info.species);
        setGender(r.data.pet_info_gender);
        setPetImgaeUrl(r.data.pet_info.petImage);
        setWeight(r.data.pet_info.weight);
        setNeutering(r.data.pet_info.neutering);
        setAnimalHospital(r.data.pet_info.animalHospital);
        setVaccination(r.data.pet_info.vaccination);
        setEtc(r.data.pet_info.etc);
      })
      .catch((e: any) => {
        alertBox("펫 정보를");
        console.log(e);
      });
  }, []);

  //펫정보 수정api
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      setPetImage(event.target.files[0]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // 이미지 업로드 함수
  const handleImageUpload = () => {
    const fileInput = document.getElementById("fileInput") as HTMLInputElement;
    fileInput.click();
  };

  // 미리보기 이미지를 삭제하는 함수
  const handleRemoveClick = () => {
    setPetImage(null);
    setPreviewImage(null);
    const fileInput = document.getElementById("file") as HTMLInputElement;
    fileInput.value = "";
  };

  //펫정보 등록api
  const handleSubmit = () => {
    const formData = new FormData();

    if (id === undefined) {
      alertBox("펫 정보를 가져오지 못했습니다.");
      return;
    }

    formData.append("pet_id", id);
    formData.append("pet_name", name);
    formData.append("pet_age", age);
    formData.append("species", species);
    formData.append("gender", gender);
    formData.append("image_change_check", previewImage !== null ? "true" : "false");
    formData.append("image", petImage as File | Blob);

    instanceMultipart
      .post("/mypage/pet/edit/step1", formData)
      .then((r: any) => {
        console.log(r.data);
        alertBox("펫 정보가 수정되었습니다.");
        navigate("/profile/petProfile");
      })
      .catch((error: any) => {
        alertBox("펫 정보 수정에 실패했습니다.");
        console.error(error);
      });
  };

  //추가정보 등록 페이지
  useEffect(() => {
    // 체크리스트 체크여부 확인
    const checkedItems = checkList
      .filter((list) => list.checked)
      .map((list) => list.name)
      .join(", ");

    setVaccination(checkedItems);
  }, [checkList]);
  useEffect(() => {
    console.log(vaccination);
  }, [vaccination]);

  //펫정보 등록api
  const handleSubmit2 = () => {
    console.log({ id, weight, neutering, animalHospital, vaccination, etc });

    instanceJson
      .post("/mypage/pet/edit/step2", { id: id, weight: weight, neutering: neutering, animalHospital: animalHospital, vaccination: vaccination, etc: etc })
      .then((r: any) => {
        console.log(r.data);
        alertBox("펫 정보가 수정되었습니다.");
        navigate("/profile/petProfile");
      })
      .catch((error: any) => {
        alertBox("펫 정보 수정에 실패했습니다.");
        console.error(error);
      });
  };

  return (
    <>
      {pageState ? (
        <>
          <Topbar backUrl="/profile/petProfile" title="펫 필수 정보 수정" sendText="완료" sendFunction={handleSubmit}></Topbar>
          <div className="z-10 bg-white w-full h-screen flex flex-col justify-start items-center">
            {previewImage ? (
              <div className="w-full mt-24 px-6 relative">
                {/* 이미지가 있을 때 */}
                <img className="rounded-xl border-bdgray w-full" src={previewImage} alt="preview" />
                <button className="absolute top-1 right-7" onClick={handleRemoveClick}>
                  <i className="xi-close-min xi-3x"></i>
                </button>
              </div>
            ) : (
              <div className="w-full mt-24 px-6">
                {/* 이미지가 없을 때 */}
                <img className="rounded-xl border-bdgray w-full" src={petImageUrl} onClick={handleImageUpload} />
                <input type="file" id="fileInput" style={{ display: "none" }} onChange={handleImageChange} />
              </div>
            )}
            <div className="flex flex-col justify-start items-start w-full gap-7">
              <div className="flex flex-col mt-7 w-full p-6 gap-7">
                {/*이름*/}
                <div className="ml-1 font-black">
                  <span>이름</span>
                  <input placeholder={name} className="mt-2 border-2 rounded-lg border-stone-400 w-full py-3 px-2 font-black" type="text" onChange={(e) => setName(e.target.value)} />
                </div>
                {/*나이*/}
                <div className="ml-1 font-black">
                  <span>나이</span>
                  <input placeholder={age} className="mt-2 border-2 rounded-lg border-stone-400 w-full py-3 px-2 font-black" type="text" onChange={(e) => setAge(e.target.value)} />
                </div>
                {/*견종*/}
                <div className="ml-1 font-black">
                  <span>견종</span>
                  <input placeholder={species} className="mt-2 border-2 rounded-lg border-stone-400 w-full py-3 px-2 font-black" type="text" onChange={(e) => setSpecies(e.target.value)} />
                </div>
                <div className="flex items-center gap-5 mb-20">
                  <span className="font-extrabold text-lg">성별</span>
                  <label className="flex items-center">
                    <input type="radio" value="male" name="gender" onChange={(e) => setGender(e.target.value)} />
                    <span className="ml-1 font-bold">남자아이</span>
                  </label>
                  <label className="flex items-center ">
                    <input type="radio" value="female" name="gender" onChange={(e) => setGender(e.target.value)} />
                    <span className="ml-1 font-bold">여자아이</span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Topbar backUrl="/profile/petProfile" title="펫 추가 정보 수정" sendText="완료" sendFunction={handleSubmit2}></Topbar>
          <div className="bg-white w-full h-screen flex flex-col justify-start items-center">
            <div className="flex flex-col justify-start items-start w-full gap-7">
              <div className="flex flex-col mt-20 w-full p-6 gap-7">
                {/*몸무게*/}
                <div className="ml-1 font-black">
                  <span>몸무게</span>
                  <input
                    onChange={(e) => {
                      setWeight(e.target.value);
                    }}
                    placeholder={weight}
                    className="mt-2 border-2 rounded-lg border-stone-400 w-full p-3 font-bold"
                    type="text"
                  />
                </div>
                {/*동물병원*/}
                <div className="ml-1 font-black">
                  <span>동물병원</span>
                  <input
                    onChange={(e) => {
                      setAnimalHospital(e.target.value);
                    }}
                    placeholder={animalHospital}
                    className="mt-2 border-2 rounded-lg border-stone-400 w-full p-3 font-bold"
                    type="text"
                  />
                </div>
                {/*중성화 여부*/}
                <div className="ml-1 font-black flex justify-start items-center">
                  <span className="mr-5">중성화 여부</span>
                  <div className=" flex items-center gap-5">
                    <label>
                      <input onChange={() => setNeutering(true)} checked={neutering === true} className="mr-1" type="radio" name="neutered" value="true" />
                      <span>했어요</span>
                    </label>
                    <label>
                      <input onChange={() => setNeutering(false)} checked={neutering === false} className="mr-1" type="radio" name="neutered" value="false" />
                      <span>안했어요</span>
                    </label>
                  </div>
                </div>

                {/*체크리스트*/}
                <div className="ml-1 font-black">
                  <span>체크리스트</span>
                  <div
                    onClick={() => {
                      setCheckListState(true);
                    }}
                    className="bg-white shadow-button w-full rounded-md flex justify-between items-center px-6 py-4 mt-5">
                    <div className="flex justify-center items-center">
                      <i className="xi-align-left xi-2x text-main mr-3"></i>
                      <span className="font-extrabold text-gray">예방접종 상태</span>
                    </div>
                    <i className="xi-angle-right-min xi-x text-zinc-400"></i>
                  </div>
                </div>
                {/*기타*/}
                <div className="ml-1 font-black mb-20">
                  <span>기타 참고사항</span>
                  <textarea
                    onChange={(e) => {
                      setEtc(e.target.value);
                    }}
                    className="mt-2 border-2 rounded-lg border-stone-400 w-full p-3 h-52 font-bold"
                    placeholder={etc}></textarea>
                </div>
              </div>
            </div>
          </div>
          {/*체크리스트 모달*/}
          {checkListState ? (
            <>
              <div className="p-6 z-40 fixed top-0 bottom-0 right-0 left-0 w-fill h-screen bg-white flex flex-col justify-start items-start">
                <i
                  onClick={() => {
                    checkList.map((list: any) => {
                      list.checked = false;
                    });
                    setVaccination("접종하지 않았습니다");
                    setCheckListState(false);
                  }}
                  className="fixed top-4 left-4 xi-angle-left-min xi-2x"></i>
                {/*체크리스트*/}
                <div className="mt-20 mb-2  flex justify-center items-center">
                  <div className="mr-2 font-semibold text-gray text-base">예방접종 체크리스트</div>
                  <span className="text-xs px-2 py-1  border text-zinc-400 font-black rounded-full">중복 선택 가능</span>
                </div>
                <div className="text-lg font-bold mb-10">필수 예방접종을 완료 하셨나요?</div>
                {checkList.map((list: any, index: number) => {
                  return (
                    <div
                      key={index}
                      onClick={() => {
                        if (index === 4) {
                          let temp = [...checkList];
                          temp.map((list: any) => {
                            list.checked = false;
                          });
                          temp[index].checked = !temp[index].checked;
                          setCheckList(temp);
                        } else {
                          let temp = [...checkList];
                          temp[4].checked = false;
                          temp[index].checked = !temp[index].checked;
                          setCheckList(temp);
                        }
                      }}
                      className={"mb-4 transition-all duration-300 ease-in-out w-full p-4 bg-white shadow-button rounded-md mt-2 flex justify-between border  items-center " + (list.checked ? " border-main text-main" : "border-white")}>
                      <span className="font-semibold">{list.name}</span>
                    </div>
                  );
                })}
                <button
                  onClick={() => {
                    setCheckListState(false);
                  }}
                  className="fixed bottom-24 left-2 right-2 bg-main text-white p-3 font-bold rounded-lg">
                  저장및 완료
                </button>
              </div>
            </>
          ) : null}
        </>
      )}
      <div className="z-40 bg-white w-full flex justify-around items-center fixed bottom-0 left-0 right-0 h-20">
        <span onClick={() => setPageState(true)} className={(pageState ? "border-black " : "border-white ") + "border-t-2 flex justify-center items-center w-full h-full font-bold "}>
          기본 정보
        </span>
        <span onClick={() => setPageState(false)} className={(!pageState ? "border-black " : "border-white ") + "border-t-2 flex justify-center items-center w-full h-full font-bold "}>
          추가 정보
        </span>
      </div>
    </>
  );
}

export default PetProfileDetail;
