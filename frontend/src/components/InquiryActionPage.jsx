import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useInquiryStore } from "../store/useInquiryStore";
import { 
  FileText, 
  Plus, 
  Users, 
  Phone, 
  RefreshCw, 
  MessageSquare, 
  MoreHorizontal,
  Clock,
  CheckCircle
} from "lucide-react";

const InquiryActionsPage = () => {
  const { id } = useParams(); // inquiry id from URL
  const { fetchActionsForInquiry, addActionToInquiry } = useInquiryStore();
  const [actions, setActions] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    type: "meeting",
    note: "",
  });

  useEffect(() => {
    const loadActions = async () => {
      setIsLoading(true);
      const data = await fetchActionsForInquiry(id);
      setActions(data);
      setIsLoading(false);
    };
    loadActions();
  }, [id]);

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    await addActionToInquiry(id, form);
    const updatedActions = await fetchActionsForInquiry(id);
    setActions(updatedActions);
    setForm({ type: "meeting", note: "" });
    setIsLoading(false);
  };

  const getActionIcon = (type) => {
    switch (type) {
      case "meeting":
        return <Users className="w-4 h-4" />;
      case "demo":
        return <CheckCircle className="w-4 h-4" />;
      case "call":
        return <Phone className="w-4 h-4" />;
      case "follow-up":
        return <RefreshCw className="w-4 h-4" />;
      case "note":
        return <FileText className="w-4 h-4" />;
      default:
        return <MoreHorizontal className="w-4 h-4" />;
    }
  };

  const getActionColor = (type) => {
    switch (type) {
      case "meeting":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "demo":
        return "bg-green-100 text-green-800 border-green-200";
      case "call":
        return "bg-purple-100 text-purple-800 border-purple-200";
      case "follow-up":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "note":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Inquiry Actions</h2>
        <p className="text-gray-600">Manage actions and follow-ups for inquiry #{id}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form to add action */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Plus className="w-5 h-5" />
            Add New Action
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Action Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="meeting">Meeting</option>
                <option value="demo">Demo</option>
                <option value="call">Call</option>
                <option value="follow-up">Follow-up</option>
                <option value="note">Note</option>
                <option value="other">Other</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Note
              </label>
              <textarea
                name="note"
                value={form.note}
                onChange={handleChange}
                rows="3"
                className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter action details..."
              />
            </div>
            

            
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  Adding...
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  Add Action
                </>
              )}
            </button>
          </form>
        </div>

        {/* List of actions */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <MessageSquare className="w-5 h-5" />
            Action History
          </h3>
          
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : actions.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="w-12 h-12 mx-auto mb-3 text-gray-300" />
              <p>No actions yet.</p>
              <p className="text-sm">Add your first action using the form.</p>
            </div>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {actions.map((act, idx) => (
                <div 
                  key={idx} 
                  className={`p-4 border rounded-lg shadow-sm ${getActionColor(act.type)}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2 mb-2">
                      {getActionIcon(act.type)}
                      <span className="font-semibold capitalize">{act.type}</span>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-600">
                      <Clock className="w-3 h-3" />
                      {new Date(act.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  {act.note && (
                    <div className="text-sm mt-2 bg-white/50 rounded p-2 whitespace-pre-wrap break-words overflow-hidden">
                      {act.note.trim()}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default InquiryActionsPage;
;;