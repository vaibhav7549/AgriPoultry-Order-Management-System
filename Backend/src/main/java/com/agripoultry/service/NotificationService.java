package com.agripoultry.service;

import com.agripoultry.entity.Notification;
import com.agripoultry.repository.NotificationRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.*;

@Service
@RequiredArgsConstructor
public class NotificationService {

    private final NotificationRepository repo;

    public List<Map<String, Object>> getByUser(String userIdCode) {
        return repo.findByUserIdCodeOrderByDbIdDesc(userIdCode).stream().map(this::toMap).toList();
    }

    public List<Map<String, Object>> getAll() {
        return repo.findAllByOrderByDbIdDesc().stream().map(this::toMap).toList();
    }

    public Map<String, Object> markRead(String notifId) {
        Notification notif = repo.findByNotifId(notifId)
                .orElseThrow(() -> new RuntimeException("Notification not found: " + notifId));
        notif.setRead(true);
        repo.save(notif);
        return toMap(notif);
    }

    @Transactional
    public void markAllRead(String userIdCode) {
        repo.markAllReadByUser(userIdCode);
    }

    private Map<String, Object> toMap(Notification n) {
        Map<String, Object> m = new LinkedHashMap<>();
        m.put("id", n.getNotifId());
        m.put("title", n.getTitle());
        m.put("message", n.getMessage());
        m.put("time", n.getTime());
        m.put("read", n.getRead() != null && n.getRead());
        m.put("type", n.getType());
        return m;
    }
}
