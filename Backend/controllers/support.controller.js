import { SupportTicket } from "../models/supportTicket.models.js";

// Create support ticket
export const createTicket = async (req, res) => {
    try {
        const { subject, message, description, category, priority, relatedBooking } = req.body;
        
        // Use message if provided, otherwise use description for backward compatibility
        const ticketDescription = message || description;

        const ticket = await SupportTicket.create({
            user: req.user._id,
            subject,
            description: ticketDescription,
            category: category || 'general',
            priority: priority || 'medium',
            relatedBooking,
            messages: [{
                sender: req.user._id,
                message: ticketDescription
            }]
        });

        return res.status(201).json({
            success: true,
            message: "Support ticket created successfully",
            data: ticket
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get my tickets
export const getMyTickets = async (req, res) => {
    try {
        const tickets = await SupportTicket.find({ user: req.user._id })
            .populate('relatedBooking')
            .populate('assignedTo', 'fullName')
            .sort({ createdAt: -1 });

        return res.status(200).json({
            success: true,
            data: tickets
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Get ticket by ID
export const getTicketById = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await SupportTicket.findById(id)
            .populate('user', 'fullName email phone')
            .populate('relatedBooking')
            .populate('assignedTo', 'fullName email')
            .populate('messages.sender', 'fullName role');

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        // Check permission
        if (req.user.role !== 'admin' && ticket.user._id.toString() !== req.user._id.toString()) {
            return res.status(403).json({
                success: false,
                message: "You don't have permission to view this ticket"
            });
        }

        return res.status(200).json({
            success: true,
            data: ticket
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Add message to ticket
export const addMessage = async (req, res) => {
    try {
        const { id } = req.params;
        const { message, attachments } = req.body;

        const ticket = await SupportTicket.findById(id);

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        ticket.messages.push({
            sender: req.user._id,
            message,
            attachments
        });

        if (ticket.status === 'closed') {
            ticket.status = 'open';
        }

        await ticket.save();

        return res.status(200).json({
            success: true,
            message: "Message added successfully",
            data: ticket
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Get all tickets
export const getAllTickets = async (req, res) => {
    try {
        const { status, priority, category, page = 1, limit = 10 } = req.query;
        let query = {};
        
        if (status) query.status = status;
        if (priority) query.priority = priority;
        if (category) query.category = category;

        const tickets = await SupportTicket.find(query)
            .populate('user', 'fullName email role')
            .populate('assignedTo', 'fullName')
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .sort({ createdAt: -1 });

        const count = await SupportTicket.countDocuments(query);

        return res.status(200).json({
            success: true,
            data: tickets,
            totalPages: Math.ceil(count / limit),
            currentPage: page
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Assign ticket
export const assignTicket = async (req, res) => {
    try {
        const { id } = req.params;
        const { assignedTo } = req.body;

        const ticket = await SupportTicket.findByIdAndUpdate(
            id,
            { 
                assignedTo,
                status: 'in_progress'
            },
            { new: true }
        );

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ticket assigned successfully",
            data: ticket
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Resolve ticket
export const resolveTicket = async (req, res) => {
    try {
        const { id } = req.params;

        const ticket = await SupportTicket.findByIdAndUpdate(
            id,
            { 
                status: 'resolved',
                resolvedAt: new Date(),
                resolvedBy: req.user._id
            },
            { new: true }
        );

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: "Ticket resolved successfully",
            data: ticket
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Admin: Update ticket status
export const updateTicketStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const validStatuses = ['open', 'in_progress', 'resolved', 'closed'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                success: false,
                message: "Invalid status. Valid statuses are: " + validStatuses.join(', ')
            });
        }

        const updateData = { status };
        
        // Add timestamp and resolver info for resolved/closed status
        if (status === 'resolved') {
            updateData.resolvedAt = new Date();
            updateData.resolvedBy = req.user._id;
        }

        const ticket = await SupportTicket.findByIdAndUpdate(
            id,
            updateData,
            { new: true }
        ).populate('user', 'fullName email')
          .populate('assignedTo', 'fullName')
          .populate('resolvedBy', 'fullName');

        if (!ticket) {
            return res.status(404).json({
                success: false,
                message: "Ticket not found"
            });
        }

        return res.status(200).json({
            success: true,
            message: `Ticket status updated to ${status}`,
            data: ticket
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
