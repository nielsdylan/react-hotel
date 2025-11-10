// IMPORTACIONES  -------------
import {lazy} from 'react'
import {Navigate, type RouteObject} from 'react-router'
import MainLayout from '@/layouts/MainLayout.tsx'
import PrivateRoute from '@/app/services/PrivateRoute'
import PublicRoute from '@/app/services/PublicRoute'

// -------------
// RUTAS DE LOS COMPONENTES --------------------------
const Auth2SignIn   = lazy(() => import('@/app/auth/index'))
const Dashboard     = lazy(() => import('@/views/dashboards/dashboard'))
const Album         = lazy(() => import('@/app/view/galeria/Album'))
const ListClient    = lazy(() => import('@/app/view/configuration/clients/ListClient'))
const ListTemplates = lazy(() => import('@/app/view/templates/ListTemplates'))
const ListNiveles = lazy(() => import('@/app/view/configuration/Niveles/ListNiveles'))


// -------------

// Errorr
const Error400 = lazy(() => import('@/views/error/400'))
const Error401 = lazy(() => import('@/views/error/401'))
const Error403 = lazy(() => import('@/views/error/403'))
const Error404 = lazy(() => import('@/views/error/404'))
const Error408 = lazy(() => import('@/views/error/408'))
const Error500 = lazy(() => import('@/views/error/500'))
// -------------

// CONFIGURACION DE RUTAS-------------
const dashboardRoutes: RouteObject[] = [
    { path: '/dashboard', element: <Dashboard/> },
    // {
    //     path: '/galeria',
    //     children: [
    //         { path: 'album', element: <Album /> },
    //     ],
    // },
    // { path: '/plantillas', element: <ListTemplates/> },
    {
        path: '/configuracion',
        children: [
            { path: 'clientes', element: <ListClient /> },
            { path: 'categorias', element: <ListClient /> },
            { path: 'niveles', element: <ListNiveles /> },
            { path: 'tarifas', element: <ListClient /> },
        ],
    },
]

const errorRoutes: RouteObject[] = [
    {
        path: '/error',
        children: [
            {path: '400', element: <Error400/>},
            {path: '401', element: <Error401/>},
            {path: '403', element: <Error403/>},
            {path: '404', element: <Error404/>},
            {path: '408', element: <Error408/>},
            {path: '500', element: <Error500/>},
        ],
    },
    
]
const allRoutes: RouteObject[] = [
    {path: '/', element: <PublicRoute><Auth2SignIn/></PublicRoute>},
    {
        element: <PrivateRoute></PrivateRoute>,
        children: [
            {
                element: <MainLayout />,
                children: [
                    {
                        path: '/',
                        element: <Navigate to="/dashboard" replace/>,
                    },
                    ...dashboardRoutes,
                ],
                
            },
        ],

    },
    {path: '*', element: <Error404/>},
]

const otherRoutes: RouteObject[] = [...errorRoutes]

export const routes: RouteObject[] = [...allRoutes, ...otherRoutes]
