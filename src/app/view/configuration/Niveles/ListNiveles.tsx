
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
  {
    data: null,
    orderable: false,
    className: 'select-checkbox text-start',
    render: function () {
      return ''
    },
  },
  { data: 'company' },
  { data: 'symbol' },
  {
    data: 'price',
    render: (data: number) => {
      return `${currency}${data}`
    },
    className: 'text-start',
  },
  {
    data: 'change',
    render: (data: number) => {
      return `${data}%`
    },
    className: 'text-start',
  },
  { data: 'volume', className: 'text-start' },
  {
    data: 'marketCap',
    render: (data: string) => {
      return `${currency}${data}`
    },
  },
  {
    data: 'rating',
    render: (data: number) => {
      return `${data}★`
    },
  },
  // {
  //   data: 'status',
  //   render: (data: string) => {
  //     const badgeClass = data === 'Bullish' ? 'success' : 'danger'
  //     return `<span class="badge badge-label badge-soft-${badgeClass}">${data}</span>`
  //   },
  // },
  {
    data: 'status',
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
      return `<span class="badge badge-label badge-soft-${badgeClass}">${data}</span> ${buttonHtml}`
    },
  },
]

const Example = () => {
  DataTable.use(DT)
  const tableRef = useRef<DataTableRef | null>(null)

  const selectAllRef = useRef<HTMLInputElement | null>(null)

  useEffect(() => {
    if (tableRef.current && selectAllRef.current) {
      selectAllRef.current.addEventListener('change', () => {
        if (selectAllRef.current?.checked) {
          tableRef.current?.dt()?.rows({ search: 'applied' }).select()
        } else {
          tableRef.current?.dt()?.rows().deselect()
        }
      })

      tableRef.current?.dt()?.on('select deselect', function () {
        const totalRows = tableRef.current?.dt()?.rows({ search: 'applied' }).count()
        const selectedRows = tableRef.current?.dt()?.rows({ selected: true, search: 'applied' }).count()
        if (selectAllRef.current) {
          selectAllRef.current.checked = selectedRows === totalRows
        }
      })
    }

    
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
    <ComponentCard title="Example">
      <DataTable
        ref={tableRef}
        data={tableData.body}
        columns={columns}
        options={{
          select: {
            style: 'multi',
            selector: 'td:first-child',
            className: 'selected',
          },
          order: [[1, 'asc']],
          responsive: true,
          columnDefs: [
            {
              orderable: false,
              render: DT.render.select(),
              targets: 0,
            },
          ],
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
            <th className="fs-sm">
              <input ref={selectAllRef} type="checkbox" className="form-check-input" />
            </th>
            <th>Company</th>
            <th>Symbol</th>
            <th>Change</th>
            <th>Status</th>
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
