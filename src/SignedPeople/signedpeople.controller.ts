import { deleteASigned } from "./delete.signedpeople.action.js";
import { updateASigned } from "./update.signedpeople.action.js";
import { readSigned } from "./read.signedpeople.action.js";
import { makeASigned } from "./create.signedpeople.action.js";
import { SignedPeopleType } from "./signedpeople.model.js";
import { SENDER, SENDGRID_API_KEY } from "../App/config.js";
import sgmail from "@sendgrid/mail";

export const makeSignedController = async (signed: SignedPeopleType) => {
  try {
    return makeASigned(signed);
  } catch (error) {
    return { error: "failed to register a signed person" };
  }
};

export const deleteSignedController = async (id: string) => {
  try {
    return deleteASigned(id);
  } catch (error) {
    return { error: "Failed to delete a signed person" };
  }
};
export const updateSignedController = async (
  id: string,
  signed: SignedPeopleType,
) => {
  try {
    return updateASigned(id, signed);
  } catch (error) {
    return { error: "Failed to update a signed person" };
  }
};
export const readSignedController = async (id?: string, query?: any) => {
  try {
    return readSigned(id, query);
  } catch (error) {
    return { error: "Failed to read a signed person" };
  }
};

export const sendEmailController = async (
  email: string,
  tipo: string,
  name: string,
  user?:string,
  pass?:string
) => {
  try {
    let mail = "",
      subject = "",
      text = "";
    switch (tipo) {
      case "Touch":
        subject = "Saludo inicial";
        text = "Bienvendido al proceso de inscripción";
        mail = `<h1>Hola ${name}</h1> <p>Hemos recibido tu información, te contactaremos
        más adelante por este mismo medio o por el numero de celular que facilitaste</p> <br/> Saludos, Copa Caribe`;
        break;
      case "Contact":
        subject = "Datos necesarios para el registro";
        text = "Tu inscripción ha sido vista";
        mail = `<h1>Hola ${name}</h1> <p>Estos son los datos que necesitas diligenciar y
          mandar al siguiente correo a más tardar</p> <br/> Saludos, Copa Caribe`;
        break;
        case "Pendiente":
        subject = "Datos de pago";
        text = "Estos son los datos para el pago de la inscripción";
        mail = `<h1>Hola ${name}</h1> <p>Estos son los datos que necesitas para
          cancelar el respectivo monto de la inscripción al torneo:</p> <br/> Saludos, Copa Caribe`;
        break;
      case "Introduction":
        subject = "Bienvenido a Copa Caribe";
        text = "¿Listo para participar?";
        mail = `<h1>Hola ${name}, bienvenido a Copa Caribe</h1> <p>Esperamos y se pueden
        cumplir tus metas en el torneo con tu(s) equipo(s)</p> <br/>usuario:${user} <br/>Contraseña:${pass}
         <br/>Con esto podrás acceder a través de nuestra pagina oficial  <br/> Saludos, Copa Caribe`;
        break;
    }

    sgmail.setApiKey(SENDGRID_API_KEY);

    const msg = { to: email, from: SENDER, subject, text, html: mail };
    await sgmail.send(msg);

    return { success: "Email sent successfully!" };
  } catch (error) {
    return { error: "Failed to send the email" };
  }
};
