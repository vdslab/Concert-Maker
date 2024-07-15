// import React from "react";
// import {
//   Paper,
//   Typography,
//   List,
//   ListItem,
//   ListItemText,
//   Divider,
//   Box,
//   IconButton,
//   Grid,
// } from "@mui/material";
// import { styled } from "@mui/system";
// import CloseIcon from "@mui/icons-material/Close";
// import SplitButton from "./SplitButton";
// import { musicServices } from "./constants";

// const StyledPaper = styled(Paper)(({ theme }) => ({
//   position: "absolute",
//   top: "30px",
//   left: "10px",
//   width: "400px",
//   height: "calc(100vh - 100px)",
//   maxHeight: "calc(100vh - 100px)",
//   overflowY: "auto",
// }));

// const StyledIconButton = styled(IconButton)(({ theme }) => ({
//   position: "absolute",
//   top: "10px",
//   right: "10px",
// }));

// const NodeInfo = ({ node, onClose }) => {
//   if (!node) return null;

//   const relatedWorks = [
//     {
//       title: node.title,
//       composer: node.composer,
//       duration: "33分",
//       id: "2022-2200-tmp-str",
//     },
//   ];

//   return (
//     <StyledPaper>
//       <Box p={2}>
//         <StyledIconButton onClick={onClose}>
//           <CloseIcon />
//         </StyledIconButton>
//         <Typography variant="h5" gutterBottom>
//           {node.title}
//         </Typography>
//         <Typography variant="body2" gutterBottom>
//           演奏時間: 33分
//         </Typography>
//         <Typography variant="body2" color="textSecondary" gutterBottom>
//           {node.workFormulaStr}
//         </Typography>
//         <SplitButton songId={node.id} />
//       </Box>
//       <Divider />
//       <Box p={2}>
//         <Typography variant="h6" gutterBottom>
//           詳細情報
//         </Typography>
//         <List>
//           {[
//             "I. Un poco sostenuto; Allegro",
//             "II. Andante sostenuto",
//             "III. Un poco allegretto e grazioso",
//             "IV. Adagio; Più andante; Allegro non troppo, ma con brio",
//           ].map((movement, index) => (
//             <ListItem key={index} dense>
//               <ListItemText
//                 primary={movement}
//                 secondary={
//                   index === 0
//                     ? "13分"
//                     : index === 1
//                     ? "10分"
//                     : index === 2
//                     ? "5分"
//                     : "17分"
//                 }
//               />
//             </ListItem>
//           ))}
//         </List>
//       </Box>
//       <Divider />
//       <Box p={2}>
//         <Typography variant="h6" gutterBottom>
//           聴く
//         </Typography>
//         <Grid container spacing={2} justifyContent="space-between">
//           {musicServices.map((service, index) => (
//             <Grid item key={index}>
//               <Box display="flex" flexDirection="column" alignItems="center">
//                 <img
//                   src={service.icon}
//                   alt={service.name}
//                   style={{ width: 40, height: 40, marginBottom: 5 }}
//                 />
//                 <Typography variant="caption">{service.name}</Typography>
//               </Box>
//             </Grid>
//           ))}
//         </Grid>
//       </Box>
//       <Divider />
//       <Box p={2}>
//         <Typography variant="h6" gutterBottom>
//           よく一緒に演奏されている曲
//         </Typography>
//         {relatedWorks.map((work, index) => (
//           <Box key={index} mb={2}>
//             <Typography variant="subtitle1">{work.title}</Typography>
//             <Typography variant="body2">{work.composer}</Typography>
//             <Typography variant="body2" color="textSecondary">
//               演奏時間: {work.duration} | {work.id}
//             </Typography>
//           </Box>
//         ))}
//       </Box>
//     </StyledPaper>
//   );
// };

// export default NodeInfo;
