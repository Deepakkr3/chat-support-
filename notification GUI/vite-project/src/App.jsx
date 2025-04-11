import MSG from "./components/MSG";
import CreatTicket from "./components/CreatTicket";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import SupportView from "./components/Support";
import UpdateTicketStatus from "./components/UpdateTicketStatus";
import UserRoom from "./components/UserRoom";
import Test from "./components/Test";

const App = function () {
  return (
    <Router>
      <Routes>
        <Route path="/support/ticket/message" element={<MSG />} />
        <Route path="/support/ticket" element={<CreatTicket />} />
        <Route path="/support" element={<SupportView />} />
        <Route path="/support/ticket/update-ticket" element={<UpdateTicketStatus />} />
        <Route path="/chat" element={<UserRoom />} />

      </Routes>
    </Router>
  );
};

export default App;
