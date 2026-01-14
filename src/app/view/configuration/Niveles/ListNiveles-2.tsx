import PageBreadcrumb from "@/components/PageBreadcrumb";
import {
  Button,
  Col,
  Container,
  FormControl,
  FormLabel,
  Row,
} from "react-bootstrap";
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Table,
  Modal,
  ModalBody,
  ModalFooter,
  ModalHeader,
  ModalTitle,
} from "react-bootstrap";
import { TbDotsVertical, TbEdit, TbTrash } from "react-icons/tb";
import { useEffect, useState } from "react";
import {
  deletRegister,
  getLista,
  getFind,
  postGuardar,
} from "@/app/services/configurations/nivelServices";
import type { Nivel } from "@/app/services/interface/Nivel";

import useToggle from "@/hooks/useToggle";
import { LuSave } from "react-icons/lu";
import { sweet } from "@/utils/alerts";
import withReactContent from "sweetalert2-react-content";
import Swal from "sweetalert2";

const ListNiveles = () => {
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const { isTrue: isOpen, toggle: toggleModal } = useToggle();

  const fetchLista = async () => {
    try {
      const respons: { data: Nivel[] } = await getLista();

      setNiveles(respons.data);
    } catch (error) {
      console.log(error);
    } finally {
      // console.log('finalizo');
    }
  };

  useEffect(() => {
    fetchLista();
  }, []);
  // ------ acciones-------------
  const [formData, setFormData] = useState({
    nombre: "",
    id: 0,
  });

  const handleEdit = async (id: number) => {
    const respons: Nivel = await getFind(id);

    setFormData({
      nombre: respons.nombre, // Asegúrate de que 'nombre' exista en el objeto Nivel
      id: respons.id, // Asegúrate de que 'nombre' exista en el objeto Nivel
    });
    console.log(formData);

    toggleModal();
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que se recargue la página
    const respons = await postGuardar(formData);
    fetchLista();
    toggleModal();
    sweet({
      title: respons.titulo,
      icon: respons.tipo,
      text: respons.mensaje,
      customClass: { confirmButton: "btn btn-" + respons.tipo },
    });

    console.log(respons);
  };

  const ReactSwal = withReactContent(Swal);
  const handleDelet =  (id: number) => {
    ReactSwal.fire({
      title: "Alerta",
      text: "¿Esta seguro de liminar este registro?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Si, eliminar!",
      showCloseButton: true,
      buttonsStyling: false,
      customClass: {
        confirmButton: "btn btn-success me-2 mt-2",
        cancelButton: "btn btn-danger mt-2",
      },
    }).then( async (result) => {
      if (result.isConfirmed) {
        const data = {
          id: id
        };
        const respons = await deletRegister(data);
        console.log(respons);
        fetchLista();
        sweet({
          title: respons.titulo,
          text: respons.mensaje,
          icon: respons.tipo,
          customClass: { confirmButton: "btn btn-"+respons.tipo },
        });
      }
    });
  };

  return (
    <Container fluid>
      <PageBreadcrumb title="Gestion de los Niveles" subtitle="Configuracion" />
      <Row className="justify-content-center">
        <Col xxl={12}>
          <Card>
            <CardHeader className="justify-content-between">
              <CardTitle> Lista de Niveles </CardTitle>
              {/* <span className="badge badge-label badge-soft-success fs-xxs">
                Exclusive
              </span> */}
            </CardHeader>

            <CardBody className="">
              <Row className="justify-content-center">
                <Col xxl={12}>
                  <Table responsive className="table-custom align-middle mb-0">
                    <thead className="bg-light align-middle bg-opacity-25 thead-sm">
                      <tr className="text-uppercase fs-xxs">
                        <th>N°</th>
                        <th>NOMBRE</th>
                        <th>ESTADO</th>
                        <th style={{ width: "1%" }}>ACCIÓN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {niveles.map((item, idx) => (
                        <tr key={idx}>
                          <td>{idx + 1}</td>
                          <td>{item.nombre}</td>
                          <td>
                            <span
                              className={`badge badge-label badge-soft-${
                                item.estado === 1 ? "success" : "warning"
                              }`}
                            >
                              {item.estado ? "Activo" : "Inactivo"}
                            </span>
                          </td>
                          <td className="text-end">
                            <Dropdown align="end" className="text-muted">
                              <DropdownToggle
                                variant="link"
                                className="drop-arrow-none fs-xxl link-reset p-0"
                              >
                                <TbDotsVertical />
                              </DropdownToggle>
                              <DropdownMenu>
                                {/* <DropdownItem >
                                  <TbEye className="me-1" /> View
                                </DropdownItem> */}
                                <DropdownItem
                                  onClick={() => handleEdit(item.id)}
                                >
                                  <TbEdit className="me-1" /> Edit
                                </DropdownItem>
                                <DropdownItem
                                  onClick={() => handleDelet(item.id)}
                                  className="text-danger"
                                >
                                  <TbTrash className="me-1" /> Delete
                                </DropdownItem>
                              </DropdownMenu>
                            </Dropdown>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal
        className="fade"
        show={isOpen}
        onHide={toggleModal}
        backdrop="static"
        keyboard={false}
      >
        <ModalHeader closeButton>
          <ModalTitle as="h5">Editar Nivel</ModalTitle>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="row">
              <div className="col-md-12">
                {/* <div className="form-group">
                  <label htmlFor="nombre">Nombre</label>
                  <input
                    type="text"
                    className="form-control"
                    id="nombre"
                    name="nombre"
                    placeholder="Ingresa tu nombre"
                    value={formData.nombre}
                    onChange={handleChange}
                    required
                  />
                </div> */}
                <FormLabel htmlFor="nombre" className="col-form-label">
                  Nombre:
                </FormLabel>
                <FormControl
                  type="text"
                  className="form-control form-control-sm"
                  id="nombre"
                  name="nombre"
                  placeholder="Ingresa tu nombre..."
                  value={formData.nombre}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </ModalBody>
          <ModalFooter>
            <Button variant="default" onClick={toggleModal} className="btn-sm">
              Cerrar
            </Button>
            <Button variant="success" type="submit" className="btn-sm">
              {" "}
              <LuSave /> Guardar{" "}
            </Button>
          </ModalFooter>
        </form>
      </Modal>
    </Container>
  );
};

export default ListNiveles;
