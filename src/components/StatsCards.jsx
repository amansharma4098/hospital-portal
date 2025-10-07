// src/components/StatsCards.jsx
import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  Grid,
  Typography,
  Box,
  Avatar,
  useTheme,
} from "@mui/material";
import PeopleIcon from "@mui/icons-material/People";
import GroupIcon from "@mui/icons-material/Group";
import LocalHospitalIcon from "@mui/icons-material/LocalHospital";
import WorkOutlineIcon from "@mui/icons-material/WorkOutline";

// Smooth count animation
function AnimatedNumber({ value, duration = 800 }) {
  const [display, setDisplay] = useState(0);

  useEffect(() => {
    const end = Number(value) || 0;
    const start = 0;
    const steps = 20;
    const increment = (end - start) / steps;
    let currentStep = 0;

    const timer = setInterval(() => {
      currentStep++;
      setDisplay(Math.round(start + increment * currentStep));
      if (currentStep >= steps) clearInterval(timer);
    }, duration / steps);

    return () => clearInterval(timer);
  }, [value, duration]);

  return <>{display}</>;
}

function StatCard({ title, subtitle, value, icon, color, onClick }) {
  const theme = useTheme();

  return (
    <Card
      onClick={onClick}
      sx={{
        cursor: "pointer",
        height: "100%",
        borderRadius: 3,
        overflow: "hidden",
        position: "relative",
        transition: "transform 0.25s ease, box-shadow 0.25s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: 6,
        },
      }}
    >
      {/* Colored side accent */}
      <Box
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 6,
          height: "100%",
          bgcolor: color || theme.palette.primary.main,
        }}
      />

      <CardContent sx={{ pl: 3.5 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography variant="subtitle2" color="text.secondary">
              {title}
            </Typography>
            <Typography variant="h4" sx={{ fontWeight: 700, mt: 0.5 }}>
              {value === "—" ? "—" : <AnimatedNumber value={value} />}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mt: 0.5 }}>
              {subtitle}
            </Typography>
          </Box>

          <Avatar
            sx={{
              bgcolor: `${color || theme.palette.primary.main}22`,
              color: color || theme.palette.primary.main,
              width: 48,
              height: 48,
            }}
          >
            {icon}
          </Avatar>
        </Box>
      </CardContent>
    </Card>
  );
}

export default function StatsCards({ counts, onCardClick, accent }) {
  const theme = useTheme();
  const accentColor = accent || theme.palette.primary.main;

  const renderCount = (n) =>
    n === null || n === undefined || Number(n) === 0 ? "—" : n;

  const cards = [
    {
      title: "Public Relations Officers",
      subtitle: "Request PR / Communications staff",
      value: renderCount(counts.pro_count),
      icon: <GroupIcon />,
      color: theme.palette.info.main,
      onClick: () => onCardClick("pros"),
    },
    {
      title: "Staff",
      subtitle: "Request permanent/temporary staff",
      value: renderCount(counts.staff_count),
      icon: <PeopleIcon />,
      color: theme.palette.primary.main,
      onClick: () => onCardClick("staff"),
    },
    {
      title: "Doctors",
      subtitle: "Request visiting or full-time doctors",
      value: renderCount(counts.doctor_count),
      icon: <LocalHospitalIcon />,
      color: theme.palette.success.main,
      onClick: () => onCardClick("doctor"),
    },
    {
      title: "Other Requests",
      subtitle: "Procurement, onboarding and other requests",
      value: renderCount(counts.request_count),
      icon: <WorkOutlineIcon />,
      color: theme.palette.warning.main,
      onClick: () => onCardClick("other"),
    },
  ];

  return (
    <Grid container spacing={2}>
      {cards.map((card, i) => (
        <Grid item xs={12} sm={6} key={i}>
          <StatCard {...card} />
        </Grid>
      ))}
    </Grid>
  );
}
