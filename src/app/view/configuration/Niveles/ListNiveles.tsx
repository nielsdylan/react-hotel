
import ComponentCard from '@/components/cards/ComponentCard'
import PageBreadcrumb from '@/components/PageBreadcrumb'
import { Col, Container, Row } from 'react-bootstrap'

import DT from 'datatables.net-bs5'
import DataTable, {type  DataTableRef } from 'datatables.net-react'
import 'datatables.net-responsive'
import 'datatables.net-select'

import ReactDOMServer from 'react-dom/server'
import { TbChevronLeft, TbChevronRight, TbChevronsLeft, TbChevronsRight } from 'react-icons/tb'

import { tableData } from '@/views/tables/data-tables/data'
import { currency } from '@/helpers'
import { useEffect, useRef, useState } from 'react'
import type { Nivel } from '@/app/services/interface/Nivel'
import { getLista } from '@/app/services/configurations/nivelServices'

const columns = [


  { data: 'id' },
  { data: 'nombre' },
  // { data: 'estado' },
  {
    data: 'estado',
    render: (data: number) => {
      const badgeClass = data === 1 ? 'success' : 'danger'
      const textEstado = data === 1 ? 'Activo' : 'Inactivo'
      return `<span class="badge badge-label badge-soft-${badgeClass}">${textEstado}</span>`
    },
  },
  {
    data: 'id',
    render: (data: string, row: any) => {
      const badgeClass = data === 'Bullish' ? 'success' : 'danger'
      const buttonHtml = ReactDOMServer.renderToStaticMarkup(
        <div className="d-flex gap-1 ms-2">
          <button className="btn btn-sm btn-outline-primary btn-custom" data-id={row.symbol} data-action="edit">
            Editar
          </button>
          <button className="btn btn-sm btn-outline-danger btn-custom" data-id={row.symbol} data-action="delete">
            Eliminar
          </button>
        </div>
        
      )
      // Combina el badge HTML existente con el nuevo botón HTML
      return `${buttonHtml}`
    },
    className: 'text-start',
  },
]

const Example = () => {
  DataTable.use(DT)
  const tableRef = useRef<DataTableRef | null>(null)


  useEffect(() => {
    
    const container = tableRef.current?.dt()?.table().container();
    const handleTableClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      // Buscamos si el clic fue en cualquier botón con la clase 'btn-custom'
      const btn = target.closest('.btn-custom');
      
      if (btn) {
        const id = btn.getAttribute('data-id');
        const action = btn.getAttribute('data-action');

        // Decidimos qué hacer según el botón
        switch (action) {
          case 'edit':
            console.log("Editando el registro:", id);
            // llamarFuncionEditar(id);
            break;
          case 'delete':
            console.log("Eliminando el registro:", id);
            // llamarFuncionEliminar(id);
            break;
          default:
            console.log("Acción no reconocida");
        }
      }
    };

    // VALIDACIÓN: Solo si container existe, ejecutamos los métodos
    if (container) {
      container.addEventListener('click', handleTableClick);

      // La limpieza (return) debe estar dentro del useEffect principal, 
      // pero el removeEventListener también necesita que container exista.
      return () => {
        container.removeEventListener('click', handleTableClick);
      };
    }
  }, []);

  // onclick del boton
  const [niveles, setNiveles] = useState<Nivel[]>([]);
  const fetchLista = async () => {
      try {
        const respons: { data: Nivel[] } = await getLista();
  
        setNiveles(respons.data);
        console.log(respons.data);
        
      } catch (error) {
        console.log(error);
      } finally {
        // console.log('finalizo');
      }
    };
  
    useEffect(() => {
      fetchLista();
    }, []);
  return (
    <ComponentCard title="Lista de Niveles">
      <DataTable
        ref={tableRef}
        data={niveles}
        columns={columns}
        options={{
          order: [[1, 'asc']],
          responsive: true,
          language: {
            paginate: {
              first: ReactDOMServer.renderToStaticMarkup(<TbChevronsLeft className="fs-lg" />),
              previous: ReactDOMServer.renderToStaticMarkup(<TbChevronLeft className="fs-lg" />),
              next: ReactDOMServer.renderToStaticMarkup(<TbChevronRight className="fs-lg" />),
              last: ReactDOMServer.renderToStaticMarkup(<TbChevronsRight className="fs-lg" />),
            },
          },
        }}
        className="table table-striped dt-responsive dt-select-checkbox align-middle mb-0">
        <thead className="thead-sm text-uppercase fs-xxs">
          <tr>
            <th>#</th>
            <th>Nombre</th>
            <th>Estado</th>
            <th>Acción</th>
          </tr>
        </thead>
      </DataTable>
    </ComponentCard>
  )
}

const ListNiveles = () => {
  
  return (
    <Container fluid>
      <PageBreadcrumb title="Checkbox Select" subtitle="Data Tables" />

      <Row className="justify-content-center">
        <Col xxl={12}>
          <Example />
        </Col>
      </Row>
    </Container>
  )
}

export default ListNiveles
