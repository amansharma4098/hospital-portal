// src/components/StatsCards.jsx
import React from "react";
import { Card, CardContent, Grid, Typography } from "@mui/material";

function StatCard({ title, subtitle, value, onClick, accent }) {
  return (
    <Card onClick={onClick} sx={{ cursor: "pointer", height: "100%", "&:hover": { boxShadow: 6 }, borderLeft: `6px solid ${accent}` }}>
      <CardContent>
        <Typography variant="subtitle2" color="text.secondary">{title}</Typography>
        <Typography variant="h5" sx={{ fontWeight: 700 }}>{value}</Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>{subtitle}</Typography>
      </CardContent>
    </Card>
  );
}

export default function StatsCards({ counts, onCardClick, accent }) {
  const renderCount = (n) => (n === null || n === undefined || Number(n) === 0 ? "—" : n);
  return (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={6}>
        <StatCard title="Public Relations Officers" subtitle="Request PR / Communications staff" value={renderCount(counts.pro_count)} onClick={() => onCardClick("pros")} accent={accent} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <StatCard title="Staff" subtitle="Request permanent/temporary staff" value={renderCount(counts.staff_count)} onClick={() => onCardClick("staff")} accent={accent} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <StatCard title="Doctors" subtitle="Request visiting or full-time doctors" value={renderCount(counts.doctor_count)} onClick={() => onCardClick("doctor")} accent={accent} />
      </Grid>
      <Grid item xs={12} sm={6}>
        <StatCard title="Other Requests" subtitle="Procurement, onboarding and other requests" value={renderCount(counts.request_count)} onClick={() => onCardClick("other")} accent={accent} />
      </Grid>
    </Grid>
  );
}
