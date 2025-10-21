import "./AccessImg.scss";
import { useState } from "react";
import logImg1 from "../../assets/img/LoginAccess.png";
import logImg2 from "../../assets/img/RegiAccess.png";

type ImageType = {
    id: number;
    src: string;
};

const images: ImageType[] = [
    { id: 0, src: logImg1 },
    { id: 1, src: logImg2 },
];

const getRandomImage = (): string => {
    const randomId = Math.floor(Math.random() * images.length); 
    const selectedImage = images.find(image => image.id === randomId); 
    return selectedImage ? selectedImage.src : logImg1;
};

const AccessImg = () => {
    const [randomImage] = useState<string>(getRandomImage()); 

    return (
        <section className="access-background">
            <img src={randomImage} alt="background" className="access-background__img" />
        </section>
    );
}

export default AccessImg;