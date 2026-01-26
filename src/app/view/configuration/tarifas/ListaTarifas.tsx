import ComponentCard from '@/components/cards/ComponentCard'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Button, Col, Container, FormControl, FormLabel, Modal, ModalBody, ModalFooter, ModalHeader, ModalTitle, OverlayTrigger, Row, Tooltip } from 'react-bootstrap'

import DT from 'datatables.net-bs5'
import DataTable, {type  DataTableRef } from 'datatables.net-react'
import 'datatables.net-responsive'
import 'datatables.net-select'

import ReactDOMServer from 'react-dom/server'
import { TbChevronLeft, TbChevronRight, TbChevronsLeft, TbChevronsRight, TbEdit, TbPlus, TbTrash } from 'react-icons/tb'

import { useEffect, useRef, useState } from 'react'
import useToggle from '@/hooks/useToggle'
import { sweet } from '@/utils/alerts'
import { LuSave } from 'react-icons/lu'
import withReactContent from 'sweetalert2-react-content'
import Swal from 'sweetalert2'
import { createRoot } from 'react-dom/client'
import { deletRegister, getFind, getLista, getListaPaginate, postGuardar } from '@/app/services/configurations/tarifaService'
import type { Tarifa } from '@/app/services/interface/Tarifa'
import type { Paginate } from '@/app/services/interface/BackEndPaginate'

const CardTable = () => {
  const columns = [
    { data: 'id',
    className: 'text-center', },
    { data: 'nombre' },
    // { data: 'estado' },
    {
      data: 'estado',
      render: (data: number) => {
        const badgeClass = data === 1 ? 'success' : 'danger'
        const textEstado = data === 1 ? 'Activo' : 'Inactivo'
        return `<span class="badge badge-label badge-soft-${badgeClass}">${textEstado}</span>`
      },
    className: 'text-center',
    },
    {
      data: 'id',
      render: (data: number) => {
        // Devolvemos un contenedor vacío donde React "aterrizará"
        return `<div class="react-action-buttons" data-id="${data}"></div>`;
      },
      createdCell: (cell: Node, cellData: any, rowData: any) => {
        // Aquí montamos el componente de React-Bootstrap en la celda recién creada
        const root = createRoot(cell as HTMLElement);
        root.render(
          <div className=" gap-1 ms-2 ">
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-${rowData.id}`} className="danger-tooltip">
                  Editar registro.
                </Tooltip>
              }
            >
              <button className="btn btn-sm btn-outline-default btn-icon rounded" onClick={() => handleEdit(Number(rowData.id))}>
                <TbEdit className="fs-lg" />
              </button>
            </OverlayTrigger>
            <OverlayTrigger
              placement="top"
              overlay={
                <Tooltip id={`tooltip-${rowData.id}`} className="danger-tooltip">
                  Eliminar registro.
                </Tooltip>
              }
            >
              <button className="btn btn-sm btn-outline-default btn-icon rounded" onClick={() => handleDelet(Number(rowData.id)) }>
                <TbTrash className="fs-lg" />
              </button>
            </OverlayTrigger>
            
          </div>
        );
      },
    className: 'text-center align-middle',
    }
  ]
  DataTable.use(DT)
  const tableRef = useRef<DataTableRef | null>(null)

  const [dataJson, setDataJson] = useState<Tarifa[]>([]); // donde se guarda el json que se trae del backend
  const { isTrue: isOpen, toggle: toggleModal } = useToggle(); // variable para abrir y cerrar el modal
  // json que creramos para guardar variables del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    id: 0,
  });
  // ------- Control del estado de pagionas------------------------------------- 
  const [currentPage, setCurrentPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [totalRecords, setTotalRecords] = useState(0);
  // -------------------------------------------------
  const [textModal, setTextModal] = useState("");
  const fetchLista = async (page = 1) => {
    try {
      // const respons: { data: Tarifa[] } = await getLista();
      const respons: { data: Paginate[] } = await getListaPaginate(page);
      // setDataJson(respons.data);  
      console.log(respons.data);
      
      setDataJson(respons.data); // Laravel devuelve los registros en .data
      setCurrentPage(respons.current_page);
      setLastPage(respons.last_page);
      setTotalRecords(respons.total);
    } catch (error) {
      console.log(error);
    } finally {
      // console.log('finalizo');
    }
  };
  // Funcion que se carga al inciar la vista----
  useEffect(() => {
    // fetchLista(); // hace llamado al api para qeu se use con los otros componentes
    fetchLista(currentPage);
    
  }, [currentPage]);
  // ------------------

  // FUNCION QUE TRAE INFORMACIONDE BAKEND PARA EDITAR-------------
  const handleEdit = async (id: number) => {
    const respons: Tarifa = await getFind(id);

    setFormData({
      nombre: respons.nombre, // Asegúrate de que 'nombre' exista en el objeto Nivel
      id: respons.id, // Asegúrate de que 'nombre' exista en el objeto Nivel
    });
    setTextModal("Editar Tarifa")
    
    toggleModal();
  };
  // --------------------------------------------
  // FUNCCION QUE GUARDA LOQ UE ESTA EN EL MODAL VASANDOSE EN EL ID SI ES 0 SE CREA UNO NUEVO Y SI ES MAYOR QUE CERO SE EDITA
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Evita que se recargue la página
    const respons = await postGuardar(formData);
    fetchLista(currentPage);
    toggleModal();
    sweet({
      title: respons.titulo,
      icon: respons.tipo,
      text: respons.mensaje,
      customClass: { confirmButton: "btn btn-" + respons.tipo },
    });
  };
  // --------------------------------------------
  // FUNCION QUE REALIZA EL GUARDADO CONSTANTE DE LOS DATOS DEL FORMULARIO EN EL OBJETO COMO UN JSON
  const handleChange = ( e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement> ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };
  // --------------------------------------------
  // CREAR NUEVO REGISTRO
  const handleNew = async (id: number) => {
    setFormData({
      nombre: "", // Asegúrate de que 'nombre' exista en el objeto Nivel
      id: id, // Asegúrate de que 'nombre' exista en el objeto Nivel
    });
    setTextModal("Nueva Tarifa")
    toggleModal();
  };
  // --------------------------------------------
  // ELIMINAR UN REGISTRO
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
        fetchLista(currentPage);
        sweet({
          title: respons.titulo,
          text: respons.mensaje,
          icon: respons.tipo,
          customClass: { confirmButton: "btn btn-"+respons.tipo },
        });
      }
    });
  };
  // --------------------------------------------

  return (
    <ComponentCard title="Lista de Categorias">
      <Button variant="secondary" className="mb-3 btn-sm" onClick={() => handleNew(0) }>
        <TbPlus className="fs-lg" /> 
        Nuevo
      </Button>
      <DataTable
        ref={tableRef}
        data={dataJson}
        columns={columns}
        options={{
          paging: false, // Desactivamos la paginación interna de DataTables
          info: false,   // Ocultamos la info interna para usar la nuestra
          order: [[1, 'asc']],
          responsive: true,
          language: {
            
            paginate: {
              first: ReactDOMServer.renderToStaticMarkup(<TbChevronsLeft className="fs-lg" />),
              previous: ReactDOMServer.renderToStaticMarkup(<TbChevronLeft className="fs-lg" />),
              next: ReactDOMServer.renderToStaticMarkup(<TbChevronRight className="fs-lg" />),
              last: ReactDOMServer.renderToStaticMarkup(<TbChevronsRight className="fs-lg" />),
            },
            processing: "Procesando...",
            search: "Buscar:",
            lengthMenu: "Mostrar _MENU_ registros",
            info: "Mostrando de _START_ a _END_ de _TOTAL_ registros",
            infoEmpty: "Mostrando 0 a 0 de 0 registros",
            infoFiltered: "(filtrado de un total de _MAX_ registros)",
            infoPostFix: "",
            loadingRecords: "Cargando...",
            zeroRecords: "No se encontraron resultados",
            emptyTable: "Ningún dato disponible en esta tabla"
          },
        }}
        className="table table-striped dt-responsive dt-select-checkbox align-middle mb-0">
        <thead className="thead-sm text-uppercase fs-xxs text-center">
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
      </DataTable>
      {/* Controles de Paginación Personalizados (Estilo Bootstrap) */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div>
          Mostrando página {currentPage} de {lastPage} (Total: {totalRecords} registros)
        </div>
        <div className="btn-group">
          <Button 
            variant="outline-primary" 
            size="sm" 
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
          >
            <TbChevronLeft className="fs-lg" />
            {/* Anterior */}
          </Button>
          <Button 
            variant="outline-primary" 
            size="sm" 
            disabled={currentPage === lastPage}
            onClick={() => setCurrentPage(currentPage + 1)}
          >
            <TbChevronRight className="fs-lg" />
            {/* Siguiente */}
          </Button>
        </div>
      </div>

      <Modal
        className="fade"
        show={isOpen}
        onHide={toggleModal}
        backdrop="static"
        keyboard={false}
      >
        <ModalHeader closeButton>
          <ModalTitle as="h5">{textModal}</ModalTitle>
        </ModalHeader>
        <form onSubmit={handleSubmit}>
          <ModalBody>
            <div className="row">
              <div className="col-md-12">
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
    </ComponentCard>
  )
}
const ListaTarifas = () => {
  return (
    <Container fluid>
      <PageBreadcrumb title="Gestion de Tarifas" subtitle="Configuración" />

      <Row className="justify-content-center">
        <Col xxl={8}>
          <CardTable />
        </Col>
      </Row>
    </Container>
  )
}

export default ListaTarifas
