import { adminRoutes, customerRoutes } from '../configs';

// Middleware

import adminRoute from './admins';
import customerRoute from './customers';

function route(app) {
    // Customer ----
    app.use(customerRoutes.base, customerRoute);

    // Admin ----
    app.use(adminRoutes.base, adminRoute);

    // The 404 Route
    app.use('*', function (req, res) {
        res.status(404).json({
            message: 'Page not found',
        });
    });
}

export default route;
