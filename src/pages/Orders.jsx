import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
//import Breadcrumbs from "../../components/pageProps/Breadcrumbs";
import { useSelector } from "react-redux";
import { EyeIcon, TrashIcon, WrenchIcon } from "@heroicons/react/24/outline";
//import { createOrder, getOrders } from "../../functions/order";
import { DataGrid } from "@mui/x-data-grid";
import Tooltip from "@mui/material/Tooltip";
import { GridActionsCellItem } from "@mui/x-data-grid";
import { deleteOrder, getOrders } from "../functions/order";
import Box from "@mui/material/Box";
import Chip from "@mui/material/Chip";
import CustomToolbar from "../components/ui/CustomToolbar";
import { getAllProductTitles } from "../functions/product";
//import SideNavModal from "../../components/pageProps/shopPage/shopBy/SideNavModal";
import {
  MdCheckCircle,
  MdLocalShipping,
  MdThumbUp,
  MdCancel,
  MdHourglassEmpty,
} from "react-icons/md";

const Order = () => {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchOrders = async () => {
    try {
      const res = await getOrders(); // fetch all orders from API

      const formatted = res.data.map((order, index) => ({
        id: order._id,
        index: index + 1,
        clientName: order.customer?.fullName || "", // customer name
        email: order.customer?.email || "", // email if stored
        phone: order.customer?.phone || "",
        adresse: order.customer?.address || "",
        status: order.status || "",
        productCount: order.items?.length || 0, // number of items
        subtotal: order.subtotal || 0,
        shipping: order.shipping || 0,
        total: order.total || 0,
        createdAt: new Date(order.createdAt).toLocaleString(),
      }));

      setOrders(formatted);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette commande ?"))
      return;

    try {
      await deleteOrder(id);
      alert("Commande supprimée avec succès !");
      // Refresh your orders list
      fetchOrders();
    } catch (err) {
      console.error(err);
      alert("Impossible de supprimer la commande.");
    }
  };

  const columns = [
    { field: "index", headerName: <strong>#</strong>, width: 70 },
    { field: "clientName", headerName: <strong>Client</strong>, width: 160 },
    { field: "adresse", headerName: <strong>Adresse</strong>, width: 200 },
    { field: "phone", headerName: <strong>Télephone</strong>, width: 160 },
    {
      field: "productCount",
      headerName: <strong>Nbr produit</strong>,
      width: 110,
    },
    {
      field: "total",
      headerName: <strong>total</strong>,
      width: 100,
    },
    {
      field: "status",
      headerName: <strong>Status</strong>,
      width: 170,
      renderCell: (params) => {
        if (!params.value) return null;

        let color = "default";
        let icon = null;

        switch (params.value.toLowerCase()) {
          case "livrée":
            color = "success";
            icon = <MdCheckCircle size={18} />;
            break;
          case "expédiée":
            color = "secondary";
            icon = <MdLocalShipping size={18} />;
            break;
          case "confirmée":
            color = "primary";
            icon = <MdThumbUp size={18} />;
            break;
          case "annulée":
            color = "error";
            icon = <MdCancel size={18} />;
            break;
          case "en attente":
            color = "warning";
            icon = <MdHourglassEmpty size={18} />;
            break;
          default:
            color = "default";
        }

        return (
          <Chip
            icon={icon}
            label={params.value}
            color={color}
            variant="outlined"
            sx={{ textTransform: "capitalize" }}
          />
        );
      },
    },
    { field: "createdAt", headerName: <strong>Date</strong>, width: 160 },
    {
      field: "actions",
      headerName: <strong>Actions</strong>,
      type: "actions",
      width: 120,
      getActions: (params) => [
        <Tooltip title="voir" arrow key="view">
          <GridActionsCellItem
            icon={<EyeIcon className="w-6 h-6" />}
            label="open"
            component={Link}
            to={`/order/${params.row.id}`}
          />
        </Tooltip>,
        <GridActionsCellItem
          key="edit"
          icon={<WrenchIcon className="w-6 h-6" />}
          label="Edit"
          component={Link}
          to={`/order/${params.row.id}`}
          showInMenu
        />,
        <GridActionsCellItem
          key="delete"
          icon={<TrashIcon className="w-6 h-6" />}
          label="Delete"
          onClick={() => handleDelete(params.id)} // pass the id here
          showInMenu
        />,
      ],
    },
  ];

  useEffect(() => {
    setLoading(true);
    const fetchTitles = async () => {
      try {
        const res = await getAllProductTitles();
        setProducts(res);
      } catch (err) {
        console.error("❌ Error fetching titles:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTitles();
  }, []);

  return (
    <div>
      <div className="mx-auto max-w-7xl mx-auto md:py-8 py-4 px-1 md:px-4">
        <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-4 text-gray-900">
          Suivi des commandes
        </h1>
        {/* <Breadcrumbs title="Finaliser votre commande" /> */}
        <Box
          sx={{
            height: 500,
            width: "100%",
          }}
        >
          {" "}
          <DataGrid
            sx={{
              boxShadow: 6,
              border: 1,
              borderColor: "black",
              "& .MuiDataGrid-row:hover": {
                color: "primary.main",
              },
              "& .MuiDataGrid-footerContainer": {
                backgroundColor: "#f3f4f6ff",
              },
            }}
            rows={orders}
            columns={columns}
            loading={loading}
            pageSize={10}
            slots={{ toolbar: CustomToolbar }}
            slotProps={{
              toolbar: { products },
            }}
            showToolbar
          />
        </Box>
      </div>
    </div>
  );
};

export default Order;
